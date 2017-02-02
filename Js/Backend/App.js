import Webiny from 'Webiny';
import Backups from './Modules/Backups';
import Settings from './Modules/Settings';

class Backup extends Webiny.App {
    constructor() {
        super('BackupApp.Backend');
        this.modules = [
            new Backups(this),
            new Settings(this)
        ];
    }
}
Webiny.registerApp(new Backup());
