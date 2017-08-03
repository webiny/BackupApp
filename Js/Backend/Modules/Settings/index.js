import React from 'react';
import Webiny from 'webiny';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;
        const role = 'backup-app-manager';

        this.registerMenus(
            <Menu label="System" icon="icon-tools">
                <Menu label="Backups" role={role}>
                    <Menu label="Settings" route="BackupApp.Settings"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Settings', '/backup-app/settings', () => import('./SettingsForm').then(m => m.default), 'Backup App - Settings').setRole(role)
        );
    }
}

export default Module;