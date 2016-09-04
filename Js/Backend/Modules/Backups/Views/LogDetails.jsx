import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class LogDetails extends Webiny.Ui.View {

}

LogDetails.defaultProps = {

    renderer() {
        const logProps = {
            api: '/entities/backup-app/log',
            url: this.props.log,
            fields: 'log'
        };

        return (
            <Ui.Data {...logProps}>
                {data => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.CodeHighlight language="shell">
                                {data.log}
                            </Ui.CodeHighlight>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Ui.Data>
        );
    }
};

export default LogDetails;