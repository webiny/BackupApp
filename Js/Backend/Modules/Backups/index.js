import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace BackupApp.Backend.Backups
 */
class Module extends Webiny.App.Module {

    init() {
        this.name = 'Backups';
        const Menu = Webiny.Ui.Menu;
        const role = 'backup-app-manager';

        this.registerMenus(
            <Menu label={this.i18n('System')} icon="icon-tools">
                <Menu label={this.i18n('Backups')} role={role}>
                    <Menu label={this.i18n('Backups')} route="BackupApp.Backups"/>
                </Menu>
            </Menu>
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Backups', '/backup-app/backups', () => import('./Views/BackupList').then(m => m.default), 'Backup App - Backups').setRole(role)
        );
    }
}

export default Module;