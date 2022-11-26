import React, { Component }             from 'react';
import { Collapse }                     from '@material-ui/core';
import { MdExpandLess, MdExpandMore }   from 'react-icons/md';
import { AiOutlineFileDone }            from 'react-icons/ai'
import { axios }                        from '../../../Axios';

export default class Grid_History extends Component {
    constructor() {
        super()
        this.state = {
            collapse: false,
            gridKey: Math.random(),
            entityId: '',
            profile: undefined
        }

        this.headers = [
            { displayName: 'From' },
            { displayName: 'To' },
            { displayName: 'Reference Number' },
            { displayName: 'Date of Transfer' },
            { displayName: 'Number of units' },
            { displayName: 'Status' },
        ]
    }
    componentDidMount() {
        let profile = JSON.parse(sessionStorage.getItem("profile"))     //PROFILE
        this.setState({ profile: profile })
    }

    getAuditTrail = (record) => {
        return new Promise((resolve, reject) => {

            let auditHeaders = [
                { displayName: 'Timestamp' },
                { displayName: 'User Name' },
                { displayName: 'Action' }
            ]

            let markup =
                <div>
                    <div className="blueSectionHeader">Audit Trail</div>
                    <div>
                        <HybridDataGrid key={Math.random()}
                            type="audit_grid"
                            axios={axios}
                            rowCount={10}
                            noSearch
                            headers={auditHeaders}
                            url='/omt/audit'
                            params={{ "entityId": this.state.profile.entityId, "omtId": record[2] }}
                        />
                    </div>
                </div>

            resolve(markup)
        });
    }

    render() {

        return (
            <div>
                <div style={{ padding: '10px' }}>

                    <div className="blueSectionHeader" onClick={() => this.setState({ collapse: !this.state.collapse })}>
                        Requests between {this.props.fromDate} - {this.props.toDate}
                        <div style={{ float: 'right', fontSize: '20px' }}>{(this.state.collapse) ? <MdExpandLess /> : <MdExpandMore />}</div>
                    </div>
                    <Collapse in={!this.state.collapse}>
                        <div style={{ marginTop: '10px' }}>
                            {
                                (!this.state.profile) ? '' 
                                :
                                ''
                                // <HybridDataGrid key={this.state.gridKey}
                                //                 type='Withdrawn_Requests'
                                //                 axios={axios}
                                //                 rowCount={50}
                                //                 headers={this.headers}
                                //                 url='/omt/history'
                                //                 accordion={{
                                //                     handlers: [
                                //                         { displayText: 'View Audit Trail', icon: <AiOutlineFileDone style={{ fontSize: '20px' }} />, handler: this.getAuditTrail }
                                //                     ]
                                //                 }}
                                //                 params={{ "fromDate": this.props.fromDate, "toDate": this.props.toDate, "entityId": this.state.profile.entityId }}
                                //             />
                            }
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }
}