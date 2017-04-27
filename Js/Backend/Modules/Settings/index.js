import Webiny from 'Webiny';

class Module extends Webiny.Module {

    init() {
        this.name = 'Settings';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('Backups', [
                    new Menu('Settings', 'BackupApp.Settings')
                ]).setRole('backup-app-manager')
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Settings', '/backup-app/settings', () => import('./SettingsForm').then(m => m.default), 'Backup App - Settings')
        );
    }
}

export default Module;