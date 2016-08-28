<?php
namespace Apps\BackupApp\Php\Services;

use Apps\Core\Php\DevTools\Services\AbstractService;

/**
 * Class Cron
 *
 * Runs the backup cron job
 */
class Cron extends AbstractService
{
    function __construct()
    {
        /**
         * @api.name Runs the backup cron job that creates a new backup archive
         */
        $this->api('get', '/create-backup', function () {
            return $this->createBackup();
        });
    }

    private function createBackup()
    {

    }
}