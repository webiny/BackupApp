import React from 'react';
import Webiny from 'webiny';

class LogDetails extends Webiny.Ui.View {

}

LogDetails.defaultProps = {

    renderer() {
        const logProps = {
            api: '/entities/backup-app/log',
            url: this.props.log,
            fields: 'log',
            prepareLoadedData: data => data.entity
        };

        const {Data, Grid, CodeHighlight} = this.props;

        return (
            <Data {...logProps}>
                {data => (
                    <Grid.Row>
                        <Grid.Col all={12}>
                            <CodeHighlight language="shell">
                                {data.log}
                            </CodeHighlight>
                        </Grid.Col>
                    </Grid.Row>
                )}
            </Data>
        );
    }
};

export default Webiny.createComponent(LogDetails, {modules: ['Data', 'Grid', 'CodeHighlight']});