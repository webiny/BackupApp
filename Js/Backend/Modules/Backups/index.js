import React from 'react';
import Webiny from 'webiny';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'Backups';
        const Menu = Webiny.Ui.Menu;
        const role = 'backup-app-manager';

        this.registerMenus(
            <Menu label="System" icon="icon-tools">
                <Menu label="Backups" role={role}>
                    <Menu label="Backups" route="BackupApp.Backups"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Backups', '/backup-app/backups', () => import('./Views/BackupList').then(m => m.default), 'Backup App - Backups').setRole(role)
        );
    }
}

export default Module;