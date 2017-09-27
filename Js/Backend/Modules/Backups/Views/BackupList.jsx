import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import LogDetails from './LogDetails';
import BackupBox from './BackupBox';

/**
 * @i18n.namespace BackupApp.Backend.Backups.BackupList
 */
class BackupList extends Webiny.Ui.View {

}

BackupList.defaultProps = {

    renderer() {
        const listProps = {
            api: '/entities/backup-app/log',
            query: {'_sort': '-createdOn'},
            fields: '*,backupsCreated',
            layout: null
        };

        const {View, Grid, List, Section, ExpandableList, Filters, Label} = this.props;

        return (
            <webiny-backup-app>
                <View.List>
                    <View.Header title={this.i18n('Backups')}/>
                    <View.Body>
                        <Grid.Row>
                            <Grid.Col all={3}>
                                <BackupBox backup="24h"/>
                            </Grid.Col>
                            <Grid.Col all={3}>
                                <BackupBox backup="48h"/>
                            </Grid.Col>
                            <Grid.Col all={3}>
                                <BackupBox backup="weekly"/>
                            </Grid.Col>
                            <Grid.Col all={3}>
                                <BackupBox backup="monthly"/>
                            </Grid.Col>
                        </Grid.Row>
                    </View.Body>
                </View.List>

                <View.List>
                    <View.Body>
                        <List {...listProps}>
                            {({list, meta}) => {
                                return (
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Section title={`Backup logs: ${meta.totalCount} records (showing ${meta.perPage} per page)`}/>
                                        </Grid.Col>
                                        <Grid.Col all={12}>
                                            <List.Loader/>
                                            <List.Table.Empty renderIf={!list.length}/>
                                            <ExpandableList>
                                                {list.map(row => {
                                                    return (
                                                        <ExpandableList.Row key={row.id}>
                                                            <ExpandableList.Field all={3} name="Successful" className="text-center">
                                                                {() => {
                                                                    let success = <Label type="error">No</Label>;
                                                                    if (row.successful === true) {
                                                                        success = <Label type="success">Yes</Label>;
                                                                    }
                                                                    return success;
                                                                }}
                                                            </ExpandableList.Field>
                                                            <ExpandableList.Field all={3} name="Date">
                                                                <Filters.DateTime value={row.createdOn}/>
                                                            </ExpandableList.Field>
                                                            <ExpandableList.Field all={3} name="Execution time">
                                                                {row.executionTime}
                                                            </ExpandableList.Field>
                                                            <ExpandableList.Field all={3} name="Backups created" className="text-center">
                                                                {_.size(row.backupsCreated)}
                                                            </ExpandableList.Field>
                                                            <ExpandableList.RowDetailsList title={'Backup ' + row.createdOn}>
                                                                <LogDetails log={row.id}/>
                                                            </ExpandableList.RowDetailsList>
                                                        </ExpandableList.Row>
                                                    );
                                                })}
                                            </ExpandableList>
                                        </Grid.Col>
                                        <Grid.Col all={12}>
                                            <List.Pagination/>
                                        </Grid.Col>
                                    </Grid.Row>
                                );
                            }}
                        </List>
                    </View.Body>
                </View.List>
            </webiny-backup-app>
        );
    }
};

export default Webiny.createComponent(BackupList, {modules: ['View', 'Grid', 'List', 'Section', 'ExpandableList', 'Filters', 'Label']});