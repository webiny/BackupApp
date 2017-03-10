<?php
namespace Apps\BackupApp\Php\Services;

set_time_limit(0);

use Apps\BackupApp\Php\Entities\Backup;
use Apps\BackupApp\Php\Entities\Log;
use Apps\BackupApp\Php\Entities\Settings;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\DevTools\WebinyTrait;

/**
 * Class Cron
 *
 * Runs the backup cron job
 */
class Cron extends AbstractService
{
    use WebinyTrait;

    function __construct()
    {
        parent::__construct();
        /**
         * @api.name Create backup
         * @api.description Runs the backup cron job that creates a new backup archive
         */
        $this->api('get', '/create-backup', function () {
            /*
             * We run the backup process as a parallel process so the cron manager timeout doesn't abort the action in case the request times-out.
             */

            $token = '--header "X-Webiny-Authorization: ' . urlencode($this->wConfig()->get('Application.Acl.Token')) . '"';
            $path = $this->wConfig()->get('Application.ApiPath') . '/services/backup-app/cron/run-backup-background-process';
            $cmd = 'curl -X GET ' .$path.' '.$token.' --insecure > /dev/null 2>&1 &';
            exec($cmd);

            return ['msg' => 'Backup process started - please check the Backup App logs for result.'];
        });

        $this->api('get', '/run-backup-background-process', function () {
            $this->runBackupBackgroundProcess();
        });
    }

    public function runBackupBackgroundProcess()
    {
        $logEntity = new Log();
        $service = new \Webiny\BackupService\Service($this->getConfig());
        $service->setStoreLog(false);

        try {
            $backupLog = $service->createBackup();

            // store log info
            $logEntity->successful = $service->isSuccessful();
            $logEntity->log = $backupLog;
            $logEntity->executionTime = $service->getExecutionTime();
            $createdBackups = $service->getCreatedBackups()['s3'];
            $logEntity->backupsCreated = $createdBackups;
            $logEntity->save();

            // update the latest backup entity
            if($logEntity->successful){
                $this->updateBackupList($createdBackups);
            }
        } catch (\Exception $e) {
            $logEntity->successful = $service->isSuccessful();
            $logEntity->log = 'Error: ' . $e->getMessage();
            $logEntity->save();

            echo $logEntity->log;
        }
    }

    private function getConfig()
    {
        // load the mailer settings
        $settings = Settings::load();

        if (empty($settings)) {
            throw new AppException(sprintf('Unable to load Backup App settings'));
        }

        // backup files under absolute path
        $absolutePath = realpath($this->wConfig()->get('Application.AbsolutePath', false));
        if (!$absolutePath) {
            throw new AppException('Unable to resolve application absolute path.');
        }

        // backup all database that are defined in the config
        $databases = $this->wConfig()->get('Mongo.Services')->toArray();
        $databaseConfigs = [];

        foreach ($databases as $dbName => $dbConfig) {
            // temp config
            $tempConfig = [];

            // parse arguments
            $args = $this->str($dbConfig['Arguments']['Uri']);
            if ($args->contains('@')) {
                $args = $args->explode('@');

                // host
                $tempConfig['Host'] = $args->last()->val();

                // username & password
                if ($args->first()->contains(':')) {
                    $args = $args->first()->explode(':');
                    $tempConfig['Username'] = $args->first()->val();
                    $tempConfig['Password'] = $args->last()->val();
                } else {
                    $tempConfig['Username'] = $args->first()->val();
                }
            } else {
                $tempConfig['Host'] = $args->val();
            }

            // extract database name
            $tempConfig['Database'] = $dbConfig['Calls'][0][1][0];

            $databaseConfigs[$dbName] = $tempConfig;
        }

        // S3 config
        $s3Config = [
            'RemotePath' => $settings['s3']['remotePath'],
            'AccessId'   => $settings['s3']['accessId'],
            'AccessKey'  => $settings['s3']['accessKey'],
            'Bucket'     => $settings['s3']['bucket'],
            'Region'     => $settings['s3']['region'],
            'Endpoint'   => $settings['s3']['endpoint']
        ];

        $config = [
            'Folders'           => [$absolutePath],
            'MongoDatabases'    => $databaseConfigs,
            'TempPath'          => '/tmp/backups/',
            'Frequency'         => ['Week', 'Month'],
            'S3'                => $s3Config
        ];

        // check if the user defined an encryption key
        if (isset($settings['encryptionKey']) && !empty($settings['encryptionKey'])) {
            $config['Encryption'] = [
                'Type'       => 'openssl',
                'Passphrase' => $settings['encryptionKey']
            ];
        }

        return $config;
    }

    private function updateBackupList($createdBackups)
    {
        // we expect the daily backup to be created
        if (isset($createdBackups['24h'])) {
            // if current daily backup exists in the databases,
            // we need to move that to 48h and set the current daily to the newly created backup file
            $backup48Old = Backup::findOne(['name' => '48h']);
            if ($backup48Old) {
                $backup48Old->delete();
            }

            $backup24Old = Backup::findOne(['name' => '24h']);
            if ($backup24Old) {
                $backup24Old->order = 2;
                $backup24Old->name = '48h';
                $backup24Old->filename = $createdBackups['48h']['filename'];
                $backup24Old->save();
            }
        }

        // update backup groups
        $backupGroups = ['24h' => 1, 'weekly' => 3, 'monthly' => 4];
        foreach ($backupGroups as $bg => $order) {
            if (isset($createdBackups[$bg])) {
                $backupTemp = Backup::findOne(['name' => $bg]);
                if ($backupTemp) {
                    $backupTemp->delete();
                }

                $backupTemp = new Backup();
                $backupTemp->order = $order;
                $backupTemp->name = $bg;
                $backupTemp->size = $createdBackups[$bg]['size'];
                $backupTemp->encrypted = $createdBackups[$bg]['encrypted'];
                $backupTemp->filename = $createdBackups[$bg]['filename'];
                $backupTemp->dateCreated = time();
                $backupTemp->save();
            }
        }
    }
}