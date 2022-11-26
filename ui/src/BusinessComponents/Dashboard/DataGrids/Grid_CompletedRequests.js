import React, { Component } from 'react';
import { Collapse, ButtonBase } from '@material-ui/core';
import { MdExpandLess, MdExpandMore, MdSubject } from 'react-icons/md';
import { axios } from '../../../Axios';

export default class Grid_CompletedRequests extends Component {
    constructor() {
        super()
        this.state = {
            collapse: false,
            gridKey: Math.random(),
            buyer_name: '',
            entityId: '',
            sessionCompleteID: '',
            entityName: '',
            profile: undefined
        }

        this.headers = [
            { displayName: 'From' },
            { displayName: 'To' },
            { displayName: 'Reference Number' },
            { displayName: 'Date of Transfer' },
            { displayName: 'Number of units' },
            { displayName: 'ASX Ref ID' }
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
                                            <tr><td>Units Transferred</td>      <td>: {dataSet.payload.units}</td></tr>
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

    completeRequest = (CompleteId) => {
        return new Promise((resolve, reject) => {
            let markup =
                <div>
                    <div style={{ float: 'right' }}>
                        <ButtonBase
                            style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                            onClick={this.submitComplete(CompleteId)}>
                            Submit
                    </ButtonBase>
                    </div>
                </div>
            resolve(markup)
        });

    }

    submitComplete = (CompleteId) => {
        axios.post('/submit/completeCounterparty', {
            "user": this.state.entityId,
            "units": CompleteId[4]
        })
    }

    render() {
        return (
            <div>
                <div style={{ padding: '10px' }}>
                    <div className="blueSectionHeader" onClick={() => this.setState({ collapse: !this.state.collapse })}>
                        Completed Requests
                    <div style={{ float: 'right', fontSize: '20px' }}>{(this.state.collapse) ? <MdExpandLess /> : <MdExpandMore />}</div>
                    </div>
                    <Collapse in={!this.state.collapse}>
                        <div style={{ marginTop: '10px' }}>
                            {
                            (!this.state.profile) ? '' :
                            ''
                                // <HybridDataGrid key={this.state.gridKey}
                                //     type='Completed_Requests'
                                //     axios={axios}
                                //     rowCount={10}
                                //     headers={this.headers}
                                //     url='/omt/completed'
                                //     accordion={{
                                //         handlers: [
                                //             { displayText: 'View Details', icon: <MdSubject style={{ fontSize: '20px' }} />, handler: this.getDetails }
                                //         ]
                                //     }}
                                //     params={{ "entityId": this.state.profile.entityId }}
                                // />
                                
                                }
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }
}