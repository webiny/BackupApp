<?php

namespace Apps\BackupApp\Php\Lib;

use Apps\Webiny\Php\Lib\AppNotifications\AbstractAppNotification;

class BackupSuccessNotification extends AbstractAppNotification
{
    const TITLE = 'Backup Success';
    const DESCRIPTION = 'Published when backup is created successfully';
    const SLUG = 'backup-success';
    const ROLES = ['backup-app-manager'];

    public function getSubject()
    {
        return 'System Backup';
    }

    public function getTemplate()
    {
        return 'Backup created successfully!';
    }
}