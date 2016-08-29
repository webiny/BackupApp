import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SettingsForm extends Webiny.Ui.View {

}

SettingsForm.defaultProps = {
    renderer() {
        return (
            <Ui.Settings id="backup-app">
                {(model, container) => (
                    <Ui.View.Form>
                        <Ui.View.Header
                            title="Backup App Settings"
                            description="Set your backup settings here"/>
                        <Ui.View.Body noPadding>
                            <Ui.Tabs.Tabs size="large">
                                <Ui.Tabs.Tab label="S3 Backup Location" icon="fa-hdd-o">
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Form.Fieldset title="S3 Credentials"/>

                                            <Ui.Input label="Access Id" name="settings.s3.accessId" validate="required"/>
                                            <Ui.Input label="Access Key" name="settings.s3.accessKey" validate="required"/>

                                        </Ui.Grid.Col>

                                        <Ui.Grid.Col all={6}>
                                            <Ui.Form.Fieldset title="S3 Location"/>

                                            <Ui.Input label="Bucket Name" name="settings.s3.bucket" validate="required"/>
                                            <Ui.Input
                                                label="Bucket Path"
                                                name="settings.s3.remotePath"
                                                description="Example: Projects/MyProject/"
                                                validate="required"/>
                                        </Ui.Grid.Col>

                                    </Ui.Grid.Row>

                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Form.Fieldset title="S3 Region"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input label="Region" name="settings.s3.region" description="Example: eu-central-1"
                                                      validate="required"/>
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            <Ui.Input
                                                label="Endpoint"
                                                name="settings.s3.endpoint"
                                                description="Example: http://s3.eu-central-1.amazonaws.com"
                                                validate="required,url"/>
                                        </Ui.Grid.Col>

                                        <Ui.Grid.Col all={12}>
                                            <Ui.Alert title="Region info:" close={false}>
                                                For more information regarding AWS S3 regions, please visit <a
                                                href="http://docs.aws.amazon.com/general/latest/gr/rande.html#apigateway_region"
                                                target="_blank">this link</a>
                                            </Ui.Alert>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>

                                </Ui.Tabs.Tab>

                                <Ui.Tabs.Tab label="Encryption" icon="fa-key">
                                    <Ui.Form.Fieldset title="Encryption key"/>
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Alert title="Notice:" close={false}>
                                                It is highly recommended that you set an encryption key so that your backup is encrypted
                                                before it's transferred to S3.
                                            </Ui.Alert>

                                            <Ui.Input label="Encryption Key" name="settings.encryptionKey" validate="required"/>

                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={12}>
                                            <Ui.Form.Fieldset title="Decrypting your backup"/>
                                            <p>
                                                To decrypt your backup, download the desired backup image from your S3 and run the following command:
                                            </p>
                                            <pre>openssl bf -d &lt; $yourBackupFilename &gt; backup.restored.tar.gz</pre>
                                            <p>
                                                This will prompt you for your passphrase. If the passphrase is correct, the archive will be
                                                decrypted and then you can extract it.
                                            </p>
                                        </Ui.Grid.Col>
                                    </Ui.Grid.Row>


                                </Ui.Tabs.Tab>

                                <Ui.Tabs.Tab label="Cron Setup Guide" icon="icon-info-circle">
                                    <Ui.Form.Fieldset title="About"/>

                                    <p>
                                        The Backup App needs to periodically trigger a service that actually creates the backup archives.
                                    </p>

                                    <p>
                                        This service is triggered via a cron job. This cron job can be configured via crontab,
                                        or via the Webiny Cron Manager app.
                                    </p>

                                    <p>
                                        The cron should be configured so it executes the following script once a day:
                                    </p>
                                    <Ui.Copy.Input value={webinyApiPath + '/services/backup-app/cron/create-backup'}/>
                                </Ui.Tabs.Tab>

                            </Ui.Tabs.Tabs>
                        </Ui.View.Body>
                        <Ui.View.Footer align="right">
                            <Ui.Button type="primary" onClick={container.submit} label="Save settings"/>
                        </Ui.View.Footer>
                    </Ui.View.Form>
                )}
            </Ui.Settings>
        );
    }
};


export default SettingsForm;
