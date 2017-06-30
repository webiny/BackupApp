import Webiny from 'Webiny';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'Backups';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('Backups', [
                    new Menu('Backups', 'BackupApp.Backups')
                ]).setRole('backup-app-manager')
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Backups', '/backup-app/backups', () => import('./Views/BackupList').then(m => m.default), 'Backup App - Backups')
        );
    }
}

export default Module;