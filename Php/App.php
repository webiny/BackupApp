<?php

namespace Apps\BackupApp\Php;

use Apps\BackupApp\Php\Lib\BackupSuccessNotification;

class App extends \Apps\Webiny\Php\Lib\Apps\App
{
    public function getAppNotificationTypes()
    {
        return [
            BackupSuccessNotification::class
        ];
    }
}