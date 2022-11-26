import React, { Component } from 'react';
import Layout from '../src/Components/Layout/Layout';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';
import { TextField } from '@material-ui/core';
import Grid_History from '../src/BusinessComponents/Dashboard/DataGrids/Grid_History';
import { axios } from '../../ui/src/Axios';
import { ButtonBase } from '@material-ui/core';
export default class Index extends Component {

    constructor(props) {

        super(props);

        this.state = {
            headersActionsAvailable: true,
            errors: [],
            fromDate: this.getFormattedDate(1),
            toDate: this.getFormattedDate(),
            errorMsg: '',
            gridKey: Math.random(),
            profile: undefined
        }

    }

    componentDidMount() {
        let profile = JSON.parse(sessionStorage.getItem("profile"))
        this.setState({ profile: profile })
    }


    /**
    * Returns date string in yyyy-mm-dd format
    * Builds previous date string if offset is sent
    * Example : Get string for today - 1 => getFormattedDate(1)
    **/
    getFormattedDate = (offset = 0) => {
        let dateObj = new Date();
        let date = [
            dateObj.getFullYear(),
            ('0' + (dateObj.getMonth() + 1)).slice(-2),
            ('0' + (dateObj.getDate() - offset)).slice(-2)
        ].join('-');
        return date;
    }

    buildInputField = (label, name, type, required, disabled, fullWidth) => {
        return <TextField key={name}
            type={type}
            value={this.state[name]}
            name={name}
            label={label}
            error={(required && this.state.errors.includes(name) ? true : false)}
            required={(required) ? required : false}
            disabled={(disabled) ? disabled : false}
            onChange={this.setValue}
            fullWidth={(fullWidth) ? fullWidth : false}
            InputLabelProps={{ style: { fontSize: 17 }, shrink: true }}
            size="small"
            variant="outlined" />
    }

    setValue = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    submitSearch = () => {
        this.setState({
            gridKey: Math.random()
        })
    }


    render() {

        return (
            <Layout>
                <ContentContainer heading="Historical Data"
                    minWidth="1050px"
                    maxWidth="1350px"
                >
                <div style={{ textAlign: 'right', overflow:'hidden', padding:'10px' }}>
                    <div style={{float:'right', marginLeft:'10px', marginTop:'2px'}}>
                        <ButtonBase
                            style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                            onClick={this.submitSearch}>
                            Submit
                        </ButtonBase>
                    </div>
                    <div style={{float:'right', marginLeft:'10px'}}>{this.buildInputField('To Date', 'toDate', 'date', true, false, false)}</div>
                    <div style={{float:'right', marginLeft:'10px'}}>{this.buildInputField('From Date', 'fromDate', 'date', true, false, false)}</div>
                </div>
                <div>
                    {
                        (!this.state.profile) ?
                            '' :
                            <Grid_History key={this.state.gridKey} fromDate={this.state.fromDate} toDate={this.state.toDate} />
                    }
                </div>

                </ContentContainer>
            </Layout>
        )
    }

}