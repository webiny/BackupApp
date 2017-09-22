import React from 'react';
import Webiny from 'webiny';

class SettingsForm extends Webiny.Ui.View {

}

SettingsForm.defaultProps = {
    renderer() {
        const {Settings, View, Tabs, Grid, Section, Input, Alert, Password, Copy, Button} = this.props;
        const awsRegionsLink = 'http://docs.aws.amazon.com/general/latest/gr/rande.html#apigateway_region';
        return (
            <Settings api="/entities/backup-app/settings">
                {(model, container) => (
                    <View.Form>
                        <View.Header title="Backup App Settings" description="Set your backup settings here"/>
                        <View.Body noPadding>
                            <Tabs size="large">
                                <Tabs.Tab label="S3 Backup Location" icon="fa-hdd-o">
                                    <Grid.Row>
                                        <Grid.Col all={6}>
                                            <Section title="S3 Credentials"/>
                                            <Input label="Access Id" name="s3.accessId" validate="required"/>
                                            <Password label="Access Key" name="s3.accessKey" validate="required"/>
                                        </Grid.Col>
                                        <Grid.Col all={6}>
                                            <Section title="S3 Location"/>
                                            <Input label="Bucket Name" name="s3.bucket" validate="required"/>
                                            <Input
                                                label="Bucket Path"
                                                name="s3.remotePath"
                                                description="Example: Projects/MyProject/"
                                                validate="required"/>
                                        </Grid.Col>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Section title="S3 Region"/>
                                            <Alert title="Region info:" close={false}>
                                                For more information regarding AWS S3 regions, please visit
                                                &nbsp;<a href={awsRegionsLink} target="_blank">this link</a>
                                            </Alert>
                                        </Grid.Col>
                                        <Grid.Col all={6}>
                                            <Input
                                                label="Region"
                                                name="s3.region"
                                                description="Example: eu-central-1"
                                                validate="required"/>
                                        </Grid.Col>
                                        <Grid.Col all={6}>
                                            <Input
                                                label="Endpoint"
                                                name="s3.endpoint"
                                                description="Example: http://s3.eu-central-1.amazonaws.com"
                                                validate="required,url"/>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Tabs.Tab>
                                <Tabs.Tab label="Encryption" icon="fa-key">
                                    <Section title="Encryption key"/>
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Alert title="Notice:" close={false}>
                                                It is highly recommended that you set an encryption key so that your backup is encrypted
                                                before it's transferred to S3.
                                            </Alert>
                                            <Password label="Encryption Key" name="encryptionKey"/>
                                        </Grid.Col>
                                        <Grid.Col all={12}>
                                            <Section title="Decrypting your backup"/>
                                            <p>
                                                To decrypt your backup, download the desired backup image from your S3 and run the following
                                                command:
                                            </p>
                                            <pre>openssl bf -d &lt; $yourBackupFilename &gt; backup.restored.tar.gz</pre>
                                            <p>
                                                This will prompt you for your encryption key. If the key is correct, the archive will be
                                                decrypted and then you can extract it.
                                            </p>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Tabs.Tab>

                                <Tabs.Tab label="Cron Setup Guide" icon="icon-info-circle">
                                    <Section title="About"/>
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
                                    <Copy.Input context="cron-job" value={Webiny.Config.ApiUrl + '/services/backup-app/cron/create-backup'}/>
                                </Tabs.Tab>
                            </Tabs>
                        </View.Body>
                        <View.Footer align="right">
                            <Button type="primary" onClick={container.submit} label="Save settings"/>
                        </View.Footer>
                    </View.Form>
                )}
            </Settings>
        );
    }
};


export default Webiny.createComponent(SettingsForm, {
    modules: ['Settings', 'View', 'Tabs', 'Grid', 'Section', 'Input', 'Alert', 'Password', 'Copy', 'Button']
});
