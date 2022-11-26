import React, { Component } from 'react';
import styles from './Header.module.css';
import { ButtonBase } from '@material-ui/core';
import { MdAccountBalance, MdPerson, MdPowerSettingsNew } from 'react-icons/md';
import { UI_CONTEXT_ROOT } from '../../GlobalConfig';
import { axios } from '../../Axios';
const buttonStyle = {
    height: '100%',
    float: 'left',
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: '13px',
    padding: '0 10px 0 10px',
    borderLeft: '1px solid #e4e4e4'
}

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let email = sessionStorage.getItem('email');
        let entity = sessionStorage.getItem('entityName');
        let entityDisplayName = sessionStorage.getItem('entityDisplayName');
        this.setState({ email: email, entity: entity, entityDisplayName: entityDisplayName });
    }

    logoutUser = () => {
        document.cookie = `authToken=`;
        window.location = `${UI_CONTEXT_ROOT}/`;
        sessionStorage.clear();
    }

    render() {
        return (
            <div className={styles.headerBar}>
                <div className={styles.logoHolder}>
                    <img src="/br-logo-blue.svg" width="150px" />
                </div>
                <div className={styles.headerActionsSection}>
                    <div className={styles.actionItem}>
                        <div className={styles.namePlate}>{this.state.email} <MdPerson style={{ position: 'relative', top: '2px' }} /></div>
                        <div className={styles.namePlate}>{this.state.entityDisplayName} <MdAccountBalance style={{ position: 'relative', top: '2px' }} /></div>
                    </div>
                    <ButtonBase style={buttonStyle} onClick={this.logoutUser}>
                        logout <MdPowerSettingsNew style={{ fontSize: '20px', marginLeft: '5px' }} />
                    </ButtonBase>
                </div>
            </div>
        )
    }

}