import Webiny from 'Webiny';
import Views from './Views/Views';

class Backups extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('DevTools', [
                new Menu('Backups', [
                    new Menu('Backups', 'BackupApp.Backups')
                ]).setRole('backup-app-manager')
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Backups', '/backup-app/backups', Views.BackupList, 'Backup App - Backups')
        );
    }
}

export default Backups;