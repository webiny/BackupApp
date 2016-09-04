import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class BackupDetailsModal extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
    }

    getBackupDetails(backup) {
        let backupDetails = '';

        if (backup.status === 'danger') {
            backupDetails = (<p>
                <small>
                    Your backup was not created for the given slot. Note that certain backups are created only at specific
                    times.
                    For example a weekly backup is created each Saturday and each monthly backup is created at the last day of
                    each month.
                    If that period hasn't happened since you activated your backup cron job, that is the reason why your backup
                    doesn't exist.
                    If you still think that your backup should have been created - please check the log and your settings for
                    any errors.
                </small>
            </p>);
        } else {
            let encrypted = 'NO';
            if (backup.backupDetails.encrypted) {
                encrypted = 'YES';
            }

            let backupMsg = '';
            if (backup.status === 'warning') {
                backupMsg = (
                    <p>
                        <small>
                            Note that this backup was expected to refresh on one of the last backup cron job runs, but that didn't happen
                            and
                            the current backup is out of date.
                            <br/>
                            Please check your backup log for any errors.
                        </small>
                    </p>
                );
            }

            backupDetails = (
                <div>
                    {backupMsg}
                    <dl className="dl-horizontal">
                        <dt>Date created</dt>
                        <dd><Ui.Filters.DateTime value={backup.backupDetails.dateCreated}/></dd>

                        <dt>Filename</dt>
                        <dd>{backup.backupDetails.filename}</dd>

                        <dt>Size</dt>
                        <dd><Ui.Filters.FileSize value={backup.backupDetails.size}/></dd>

                        <dt>Encrypted</dt>
                        <dd>{encrypted}</dd>
                    </dl>
                </div>
            );
        }

        return backupDetails;
    }

    renderDialog() {
        return (
            <Ui.Modal.Dialog>
                <Ui.Modal.Header title="Backup Details"/>
                <Ui.Modal.Body>
                    <Ui.Alert type={this.props.backup.status}>{this.props.backup.statusMsg}</Ui.Alert>
                    {this.getBackupDetails(this.props.backup)}
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button label="Close" onClick={this.hide}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default BackupDetailsModal;