import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace BackupApp.Backend.Settings
 */
class Module extends Webiny.App.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;
        const role = 'backup-app-manager';

        this.registerMenus(
            <Menu label={this.i18n('System')} icon="icon-tools">
                <Menu label={this.i18n('Backups')} role={role}>
                    <Menu label={this.i18n('Settings')} route="BackupApp.Settings"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Settings', '/backup-app/settings', () => import('./SettingsForm').then(m => m.default), 'Backup App - Settings').setRole(role)
        );
    }
}

export default Module;