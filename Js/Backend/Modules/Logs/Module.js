import Webiny from 'Webiny';
import Views from './Views/Views';

class Settings extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('DevTools', [
                new Menu('Backup App', [
                    new Menu('Logs', 'BackupApp.Logs')
                ])
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('BackupApp.Logs', '/backup-app/logs', Views.LogList, 'Backup App - Logs')
        );
    }
}

export default Settings;