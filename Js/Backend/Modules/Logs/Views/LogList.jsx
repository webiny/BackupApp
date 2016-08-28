import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import LogDetails from './LogDetails';

class LogList extends Webiny.Ui.View {

}

LogList.defaultProps = {

    renderer() {
        const statProps = {
            api: '/entities/backup-app/log',
            query: {'_sort': '-createdOn'},
            fields: '*',
            layout: null
        };

        return (
            <Ui.List.ApiContainer {...statProps}>
                {(errorData, meta, list) => (
                    <Ui.ExpandableList>
                        {errorData.map(row => {
                            return (
                                <Ui.ExpandableList.Row key={row.id}>
                                    <Ui.ExpandableList.Field all={6}>{row.url}</Ui.ExpandableList.Field>
                                    <Ui.ExpandableList.Field all={4}>
                                        <Ui.Filters.DateTime value={row.date}/>
                                    </Ui.ExpandableList.Field>

                                    <Ui.ExpandableList.RowDetailsContent title={row.url}>
                                        <LogDetails log={row.id}/>
                                    </Ui.ExpandableList.RowDetailsContent>


                                </Ui.ExpandableList.Row>
                            );
                        })}
                    </Ui.ExpandableList>
                )}
            </Ui.List.ApiContainer>
        );
    }
};

export default LogList;