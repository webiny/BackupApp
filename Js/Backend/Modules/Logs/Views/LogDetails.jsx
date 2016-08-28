import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class LogDetails extends Webiny.Ui.View {

}

LogDetails.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/backup-app/log',
            url: this.props.log,
            fields: '*, log'
        };

        return (
            <Ui.Data {...statProps}>
                {errorData => (
                    <Ui.Grid.Row>
                        <Ui.Grid.Col all={12}>
                            <Ui.CodeHighlight language="json">
                                {JSON.stringify(errorData.clientData, null, 2)}
                            </Ui.CodeHighlight>
                        </Ui.Grid.Col>
                    </Ui.Grid.Row>
                )}
            </Ui.Data>
        );
    }
};

export default LogDetails;