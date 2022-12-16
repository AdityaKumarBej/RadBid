import React, { Component } from 'react';
import styles from './Header.module.css';
import { ButtonBase } from '@material-ui/core';
import { MdAccountBalance, MdArrowDropDown, MdPerson, MdPowerSettingsNew, MdSettings } from 'react-icons/md';
import { UI_CONTEXT_ROOT } from '../../GlobalConfig';
import { axios } from '../../Axios';
const buttonStyle = {
	height: '100%',
	float: 'left',
	fontFamily: `'Open Sans', sans-serif`,
	fontSize: '13px',
	padding: '0 10px 0 10px',
	borderLeft: '1px solid #e4e4e4',
};
const style = {
	headerBar: {
		height: '50px',
		width: '100%',
		backgroundColor: '#ffffff',
		position: 'relative',
		zIndex: '9',
		logoHolder: {
			position: 'relative',
			float: 'left',
			margin: '10px 10px 0px 10px',
		},
		actionsSection: {
			position: 'relative',
			float: 'right',
			height: '100%',
		},
		actionItem: {
			height: '100%',
			float: 'left',
			fontFamily: `'Open Sans', sans-serif`,
			fontSize: '13px',
			padding: '0 10px 0 10px',
			borderLeft: '1px solid #e4e4e4',
		},
	},
};

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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
	};

	render() {
		return (
			<div className={styles.headerBar}>
				<div className={styles.logoHolder}>
					{/* <img src='/br-logo-blue.svg' width='150px' /> */}
				</div>

				<div className={styles.headerActionsSection}>
					<div className={styles.actionItem}>
						<div className={styles.namePlate}>
							{this.state.email} <MdPerson style={{ position: 'relative', top: '2px' }} />
						</div>
						<div className={styles.namePlate}>
							{this.state.entityDisplayName}{' '}
							<MdAccountBalance style={{ position: 'relative', top: '2px' }} />
						</div>
					</div>
					{/* 
                    <ButtonBase style={style.headerBar.actionItem} onClick={() => window.location = `${UI_CONTEXT_ROOT}/adminConsole`}>
                        Admin Console <MdSettings style={{ fontSize: '20px', marginLeft: '5px' }} />
                    </ButtonBase> */}

					<ButtonBase style={buttonStyle} onClick={this.logoutUser}>
						logout <MdPowerSettingsNew style={{ fontSize: '20px', marginLeft: '5px' }} />
					</ButtonBase>
				</div>
			</div>
		);
	}
}
