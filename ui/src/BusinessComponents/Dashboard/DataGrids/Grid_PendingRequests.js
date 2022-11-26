import React, { Component } from 'react';
import { Collapse, TextField, ButtonBase } from '@material-ui/core';
import {
    MdExpandLess, MdExpandMore,
    MdSubject, MdClose, MdCheck,
    MdCallMissed
} from 'react-icons/md';
import { axios } from '../../../Axios';

export default class Grid_PendingRequests extends Component {
    constructor() {
        super();

        this.state = {
            collapse: false,
            gridKey: Math.random(),
            buyer_name: '',
            entityId: '',
            sessionRejectID: '',
            sessionWithdrawID: '',
            profile: undefined
        }

        this.headers = [
            { displayName: 'From' },
            { displayName: 'To' },
            { displayName: 'Reference Number' },
            { displayName: 'Date of Transfer' },
            { displayName: 'Number of units' }
        ]
    }
    componentDidMount() {
        let profile = JSON.parse(sessionStorage.getItem("profile"));
        this.setState({ profile: profile })
    }

    getDetails = (record) => {
        return new Promise((resolve, reject) => {
            axios.post('/omt/getDetails', { "omtId": record[2], "entityId": this.state.profile.entityId }).then(response => {
                let dataSet = response.data.dataSet;
                let markup =
                    <div style={{ fontSize: '12px' }}>
                        <div style={{ float: 'left', marginRight: '10px' }}>
                            <div className="blueSectionHeader">Buyer Details</div>
                            <div>
                                <table>
                                    <tbody>
                                        <tr><td>Account Registration Name</td>  <td>: {dataSet.payload.buy.name}</td></tr>
                                        <tr><td>Account Designation</td>        <td>: {dataSet.payload.buy.designation}</td></tr>
                                        <tr><td>PID</td>                        <td>: {dataSet.payload.buy.id}</td></tr>
                                        <tr><td>Trading Account Number</td>     <td>: {dataSet.payload.buy.tradingAccount}</td></tr>
                                        <tr><td>SRN/HIN</td>                    <td>: {dataSet.payload.buy.srn}</td></tr>
                                        <tr><td>Mobile Phone</td>               <td>: {dataSet.payload.buy.mobilePhone}</td></tr>
                                        <tr><td>Home Phone</td>                 <td>: {dataSet.payload.buy.homePhone}</td></tr>
                                        <tr><td>Registered Address</td>         <td>: {dataSet.payload.buy.address.join()}</td></tr>
                                        <tr><td>Post Code</td>                  <td>: {dataSet.payload.buy.postcode}</td></tr>
                                        <tr><td>Country</td>                    <td>: {dataSet.payload.buy.country}</td></tr>
                                        <tr><td>Email</td>                      <td>: {dataSet.payload.buy.email}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ float: 'left', marginRight: '10px' }}>
                            <div className="blueSectionHeader">Seller Details</div>
                            <div>
                                <table>
                                    <tbody>
                                        <tr><td>Account Registration Name</td>  <td>: {dataSet.payload.sell.name}</td></tr>
                                        <tr><td>Account Designation</td>        <td>: {dataSet.payload.sell.designation}</td></tr>
                                        <tr><td>PID</td>                        <td>: {dataSet.payload.sell.id}</td></tr>
                                        <tr><td>Trading Account Number</td>     <td>: {dataSet.payload.sell.tradingAccount}</td></tr>
                                        <tr><td>SRN/HIN</td>                    <td>: {dataSet.payload.sell.srn}</td></tr>
                                        <tr><td>Mobile Phone</td>               <td>: {dataSet.payload.sell.mobilePhone}</td></tr>
                                        <tr><td>Home Phone</td>                 <td>: {dataSet.payload.sell.homePhone}</td></tr>
                                        <tr><td>Registered Address</td>         <td>: {dataSet.payload.sell.address.join()}</td></tr>
                                        <tr><td>Post Code</td>                  <td>: {dataSet.payload.sell.postcode}</td></tr>
                                        <tr><td>Country</td>                    <td>: {dataSet.payload.sell.country}</td></tr>
                                        <tr><td>Email</td>                      <td>: {dataSet.payload.sell.email}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style={{ float: 'left', marginRight: '10px' }}>
                            <div className="blueSectionHeader">Security Details</div>
                            <div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <tr><td>ASX Code</td>               <td>: {dataSet.payload.securityCode}</td></tr>
                                            <tr><td>Security Name</td>          <td>: {dataSet.payload.securityName}</td></tr>
                                            <tr><td>Security Description</td>   <td>: {dataSet.payload.securityDescription}</td></tr>
                                            <tr><td>Units to Transfer</td>      <td>: {dataSet.payload.units}</td></tr>
                                            <tr><td>Consideration</td>      <td>: {dataSet.payload.consideration}</td></tr>
                                            <tr><td>Date of Transfer</td>       <td>: {dataSet.payload.date}</td></tr>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                resolve(markup)
            })
        });
    }

    acceptRequest = (record) => {
        return new Promise((resolve, reject) => {
            let markup =
                <div>
                    <div style={{ float: 'right' }}>
                        <ButtonBase
                            style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                            onClick={() => this.submitAccept(record[2])}>
                            Submit
                        </ButtonBase>
                    </div>
                </div>
            resolve(markup)
        });
    }

    submitAccept = (omtId) => {
        axios.post('/submit/accept', {
            "entityId": this.state.profile.entityId,
            "omt": omtId
        }).then((response) => { this.refreshGrid() })
    }

    rejectRequest = (record) => {
        return new Promise((resolve, reject) => {

            let markup =
                <div>
                    <div style={{ float: 'right' }}>
                        <ButtonBase
                            style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                            onClick={() => this.submitReject(record[2])}>
                            Submit
                    </ButtonBase>
                    </div>
                    <div style={{ width: '400px', float: 'right', marginRight: '10px' }}>
                        {this.buildInputField('Reason for Rejection', 'reasonForRejection', 'text', false, false, true)}
                    </div>
                </div>

            resolve(markup)
        });
    }

    submitReject = (omtId) => {

        axios.post('/submit/reject',
            {
                "rejectReason": this.state.reasonForRejection,
                "entityId": this.state.profile.entityId,
                "omtId": omtId
            })
            .then((response) => {
                this.refreshGrid()
            }, (error) => {
                console.log(error);
            });

    }
    setValue = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }


    withdrawRequest = (record) => {
        return new Promise((resolve, reject) => {
            let markup =
                <div>
                    <div style={{ float: 'right' }}>
                        <ButtonBase
                            style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                            onClick={() => this.submitWithdraw(record[2])}>
                            Submit
                    </ButtonBase>
                    </div>
                    <div style={{ width: '400px', float: 'right', marginRight: '10px' }}>
                        {this.buildInputField('Reason for Withdrawal', 'reasonForWithdrawal', 'text', false, false, true)}
                    </div>
                </div>
            resolve(markup)
        });
    }

    submitWithdraw = (omtId) => {

        axios.post('/submit/withdraw', {
            "withdrawalReason": this.state.reasonForWithdrawal,
            "entityId": this.state.profile.entityId,
            "omtId": omtId
        })
            .then((response) => {
                this.refreshGrid();
            }, (error) => {
                console.log(error);
            });

    }

    refreshGrid = () => {
        this.setState({ gridKey: Math.random() })
    }

    buildInputField = (label, name, type, required, disabled, fullWidth) => {
        return <TextField key={name}
            type={type}
            value={this.state[name]}
            name={name}
            label={label}
            required={(required) ? required : false}
            disabled={(disabled) ? disabled : false}
            onChange={this.setValue}
            fullWidth={(fullWidth) ? fullWidth : false}
            InputLabelProps={{ style: { fontSize: 17 }, shrink: true }}
            size="small"
            variant="outlined" />
    }

    render() {
        return (
            <div>
                {
                    (this.state.profile && this.state.profile.entityType === 'BROKER') ?
                        <div>
                            <div style={{ padding: '10px' }}>
                                <div className="blueSectionHeader" onClick={() => this.setState({ collapse: !this.state.collapse })}>
                                    Pending Requests
                            <div style={{ float: 'right', fontSize: '20px' }}>{(this.state.collapse) ? <MdExpandLess /> : <MdExpandMore />}</div>
                                </div>
                                <Collapse in={!this.state.collapse}>
                                    <div style={{ marginTop: '10px' }}>
                                        {(!this.state.profile) ?
                                            ''
                                            :
                                            <HybridDataGrid key={this.state.gridKey}
                                                type='Pending_Requests'
                                                axios={axios}
                                                rowCount={10}
                                                headers={this.headers}
                                                url='/omt/pending'
                                                accordion={{
                                                    handlers: [
                                                        { displayText: 'View Details', icon: <MdSubject style={{ fontSize: '20px' }} />, handler: this.getDetails },
                                                    ]
                                                }}
                                                params={{ "entityId": this.state.profile.entityId, "direction": "observable" }}
                                            />
                                        }
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                        :
                        <div>
                            <div style={{ padding: '10px' }}>
                                <div className="blueSectionHeader" onClick={() => this.setState({ collapse: !this.state.collapse })}>
                                    Pending Requests
                        <div style={{ float: 'right', fontSize: '20px' }}>{(this.state.collapse) ? <MdExpandLess /> : <MdExpandMore />}</div>
                                </div>
                                <Collapse in={!this.state.collapse}>
                                    <div style={{ marginTop: '10px' }}>
                                        {(!this.state.profile) ?
                                            ''
                                            :
                                            ''
                                            // <HybridDataGrid key={this.state.gridKey}
                                            //     type='Pending_Requests'
                                            //     axios={axios}
                                            //     rowCount={10}
                                            //     headers={this.headers}
                                            //     url='/omt/pending'
                                            //     accordion={{
                                            //         handlers: [
                                            //             { displayText: 'View Details', icon: <MdSubject style={{ fontSize: '20px' }} />, handler: this.getDetails },
                                            //             { displayText: 'Accept', icon: <MdCheck style={{ fontSize: '20px' }} />, handler: this.acceptRequest },
                                            //             { displayText: 'Reject', icon: <MdClose style={{ fontSize: '20px' }} />, handler: this.rejectRequest }
                                            //         ]
                                            //     }}
                                            //     params={{ "entityId": this.state.profile.entityId, "direction": "actionRequired" }}
                                            // />
                                        }
                                    </div>
                                </Collapse>
                            </div>

                            <div style={{ padding: '10px' }}>
                                <div className="blueSectionHeader" onClick={() => this.setState({ selfCollapse: !this.state.selfCollapse })}>
                                    Pending Action by Counterparty
                        <div style={{ float: 'right', fontSize: '20px' }}>{(this.state.selfCollapse) ? <MdExpandLess /> : <MdExpandMore />}</div>
                                </div>
                                <Collapse in={!this.state.selfCollapse}>
                                    <div style={{ marginTop: '10px' }}>
                                        {(!this.state.profile) ?
                                            ''
                                            :
                                            ''
                                            // <HybridDataGrid key={this.state.gridKey}
                                            //     type='Pending_Requests'
                                            //     axios={axios}
                                            //     rowCount={10}
                                            //     headers={this.headers}
                                            //     url='/omt/pending'
                                            //     accordion={{
                                            //         handlers: [
                                            //             { displayText: 'View Details', icon: <MdSubject style={{ fontSize: '20px' }} />, handler: this.getDetails },
                                            //             { displayText: 'Withdraw', icon: <MdCallMissed style={{ fontSize: '20px' }} />, handler: this.withdrawRequest }
                                            //         ]
                                            //     }}
                                            //     params={{ "entityId": this.state.profile.entityId, "direction": "selfCreated" }}
                                            // />
                                        }
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                }
            </div>
        );
    }
}