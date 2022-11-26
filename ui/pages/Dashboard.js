import React, { Component } from 'react';
import { ButtonBase } from '@material-ui/core';
import Layout from '../src/Components/Layout/Layout';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';
import { MdNavigateBefore } from 'react-icons/md';
import Grid_PendingRequests from '../src/BusinessComponents/Dashboard/DataGrids/Grid_PendingRequests';
import Grid_AcceptedRequests from '../src/BusinessComponents/Dashboard/DataGrids/Grid_AcceptedRequests';
import Grid_RejectedRequests from '../src/BusinessComponents/Dashboard/DataGrids/Grid_RejectedRequests';
import Grid_WithdrawnRequests from '../src/BusinessComponents/Dashboard/DataGrids/Grid_WithdrawnRequests';
import Grid_CompletedRequests from '../src/BusinessComponents/Dashboard/DataGrids/Grid_CompletedRequests';
import Wizard_OMTCreation from '../src/BusinessComponents/Dashboard/Wizards/Wizard_OmtCreation';
import TabbedWidget from '../src/Components/Tabs/TabbedWidget';
import TabContainer from '../src/Components/Tabs/TabbedContainer';
export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            headersActionsAvailable: true,
            currentTabIdx: 0,
            currentPageIdx: 0,
            tabLabels: [
                { label: 'Pending', count: 0 },
                { label: 'Accepted', count: 0 },
                { label: 'Rejected', count: 0 },
                { label: 'Withdrawn', count: 0 },
                { label: 'Completed', count: 0 }
            ],
            tabWidgetKey: Math.random(),
            wizardKey: Math.random(),
            profile: undefined
        }
        this.tabbedWidgetRef = React.createRef();
    }

    componentDidMount() {
        let profile = JSON.parse(sessionStorage.getItem('profile'));
        this.setState({ profile: profile })
    }

    refreshPage = () => {
        this.setState({ currentPageIdx: 0, tabWidgetKey: Math.random(), wizardKey: Math.random() })
    }

    renderCreationScreen = () => {
        this.setState({ currentPageIdx: 1 })
    }

    revertToDashboard = () => {
        this.setState({ currentPageIdx: 0 })
    }

    render() {

        let headerActions = [];
        if ((this.state.currentPageIdx === 0 && this.state.headersActionsAvailable) && (this.state.profile && this.state.profile.entityType === 'CUSTOMER')) {
            headerActions.push({ label: 'Create New OMT', handler: this.renderCreationScreen });
        }
        return (
            <Layout>

                {
                    (this.state.currentPageIdx === 0) ?
                        <ContentContainer heading="Dashboard"
                            minWidth="1050px"
                            maxWidth="1350px"
                            headerActions={headerActions}>
                            <TabbedWidget resumeIdx={this.state.currentTabIdx} ref={this.tabbeWidgetRef} width="auto" tabLabels={this.state.tabLabels} tabColor="primary" indicatorColor="secondary" key={this.state.tabWidgetKey}>
                                <TabContainer> <Grid_PendingRequests /> </TabContainer>
                                <TabContainer> <Grid_AcceptedRequests /> </TabContainer>
                                <TabContainer> <Grid_RejectedRequests /> </TabContainer>
                                <TabContainer> <Grid_WithdrawnRequests /> </TabContainer>
                                <TabContainer> <Grid_CompletedRequests /> </TabContainer>
                            </TabbedWidget>
                        </ContentContainer>

                        :
                        <ContentContainer heading="New OMT Request"
                            minWidth="1050px"
                            maxWidth="1350px"
                            headerActions={headerActions}>
                            <div>
                                <div>
                                    <ButtonBase onClick={this.revertToDashboard} style={{ color: '#004681' }}>
                                        <MdNavigateBefore /> Back to Dashboard
                                    </ButtonBase>
                                </div>
                                <div>
                                    <Wizard_OMTCreation key={this.state.wizardKey} completionCallback={this.refreshPage} />
                                </div>
                            </div>
                        </ContentContainer>
                }

            </Layout>
        )
    }
}