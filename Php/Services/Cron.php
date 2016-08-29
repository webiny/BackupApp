<?php
namespace Apps\BackupApp\Php\Services;

set_time_limit(0);

use Apps\BackupApp\Php\Entities\Log;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\DevTools\Services\AbstractService;
use Apps\Core\Php\DevTools\WebinyTrait;
use Apps\Core\Php\Entities\Setting;

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
        /**
         * @api.name Runs the backup cron job that creates a new backup archive
         */
        $this->api('get', '/create-backup', function () {
            /*
             * We run the backup process as a parallel process so the cron manager timeout doesn't abort the action in case the request times-out.
             */
            $cmd = 'curl -X GET ' . $this->wConfig()
                                         ->get('Application.ApiPath') . '/services/backup-app/run-backup-background-process > /dev/null 2>&1 &';
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
            $logEntity->backupsCreated = $service->getCreatedBackups()['local'];
            $logEntity->save();
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
        $settings = Setting::findOne(['key' => 'backup-app']);

        if (empty($settings)) {
            throw new AppException(sprintf('Unable to load Backup App settings'));
        }
        $settings = $settings['settings'];

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

        // temp
        $absolutePath .= '/Configs';

        $config = [
            'Folders'           => [$absolutePath],
            'MongoDatabases'    => $databaseConfigs,
            'TempPath'          => '/tmp/backups/',
            'Frequency'         => ['Week', 'Month'],
            'BackupStoragePath' => "/tmp/storedBackups"
            // 'S3'             => $s3Config
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
}