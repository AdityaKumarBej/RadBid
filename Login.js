import React, { Component } from 'react';
import { appInfo } from '../src/GlobalConfig';
import { ButtonBase, FormControl, Select, InputLabel } from '@material-ui/core';
import Cookies from 'universal-cookie';
import styles from './Login.module.css';
import { UI_CONTEXT_ROOT, HOMEPAGE } from '../src/GlobalConfig';
const crypto = require('crypto');
let approvedDummyUsers = require('./DummyUsers.json');
const axios = require('axios-https-proxy-fix')
import {
	Button
} from '@material-ui/core';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorFields: [],
			loggingIn: false,
			showEntitySelection: false,
			errMsg: '',
			entities: [],
		};
		this.cookies = new Cookies();
		this.username = React.createRef();
		this.password = React.createRef();
	}

	execLogin = () => {
		/** Avoiding false logins */
		if (this.state.loggingIn) return;

		let creds = {};
		creds.email = this.username.current.value;
		creds.password = this.password.current.value;
		let errorFields = [];
		['email', 'password'].forEach((item) => {
			if (creds[item] === undefined || creds[item].trim().length === 0) {
				errorFields.push(item);
			}
		});

		if (errorFields.length > 0) {
			this.setState({ errorFields: errorFields, errMsg: 'Missing Inputs' });
			return;
		}

		this.setState({ errorFields: errorFields, errMsg: '', loggingIn: true });

		axios.post(`/auth/login`, { email: creds.email, password: creds.password })
		.then( async (response) => {
			if (!response.data.status) {
				this.setState({ errMsg: 'Invalid Credentials', loggingIn: false })
			} else {
				sessionStorage.setItem('email', response.data.profile.email);
				sessionStorage.setItem('accessToken', response.data.token);
				
				/** 
				 * Check if this user has multiple entities
				 *  -> If yes -> render entity selection prompt
				 */
				let entities = response.data.profile.entities;
				sessionStorage.setItem('entities', JSON.stringify(entities))
				
				if(entities.length > 1) {
					this.setState({showEntitySelection: true,  entities: entities, adminRole: this.adminRole, loggingIn: false})
				} else {
					
					sessionStorage.setItem('profile', JSON.stringify(response.data.profile))
					let entityId = response.data.profile.entityId;
					entityId = entityId.replace('_', ' ');
					sessionStorage.setItem('entityName', entityId);
					sessionStorage.setItem('entityDisplayName', response.data.profile.entityName);
					
					this.cookies.set('authToken', response.data.token, { path: UI_CONTEXT_ROOT });
					let homePage = `${UI_CONTEXT_ROOT}${HOMEPAGE}`;
					this.cookies.set('homePage', homePage, { path: UI_CONTEXT_ROOT });
					window.location = homePage
				}
			}
		})
		.catch((err) => {
			console.log(err)
			this.setState({ errMsg: 'Invalid Credentials', loggingIn: false })
		})
	};

	adminLogin = () => {
		return (
			window.location = `${UI_CONTEXT_ROOT}/advisorRegistration`
		)
	}

	handleEnter = (event) => {
		if (event.key === 'Enter') {
			this.execLogin();
		}
	};

	render() {
		return (
			<div style={{ height: '100%', width: '100%', display: 'flex', flexFlow: 'column' }}>
				<div className={styles.loginHeaderSection}>
					{/* <img src={`${UI_CONTEXT_ROOT}/br-logo-white.svg`} width='200px' /> */}
					<span className={styles.applicationName}>{appInfo.applicationName}</span>
				</div>
				<div
					className={styles.loginMidSection}
					 style={{ backgroundImage: `url('${UI_CONTEXT_ROOT}/login_backdrop.jpg') ` }}
				>
					{this.state.showEntitySelection ? (
						<div className={styles.loginForm}>
							<div className={styles.formItem}>
								<FormControl variant='outlined' style={{ minWidth: '350px', maxWidth: '350px' }}>
									<InputLabel style={{ backgroundColor: '#ffffff' }}>
										Please select entity to login as
									</InputLabel>
									<Select
										style={{ fontSize: '15px', width: '100%' }}
										id='entitySelector'
										value={this.state.selectedEntity}
										onChange={(event) => this.setState({ selectedEntity: event.target.value })}
									>
										{this.buildEntityOptions()}
									</Select>
								</FormControl>
							</div>
							<div className={styles.formItem}>
								<ButtonBase
									disabled={this.state.loggingIn}
									onClick={this.selectEntity}
									className={this.state.loggingIn ? styles.loginButton_disabled : styles.loginButton}
								>
									{this.state.loggingIn ? 'Logging In ...' : 'Log In'}
								</ButtonBase>
							</div>
						</div>
					) : (
						<div className={styles.loginForm}>
							<div className={styles.errorMessage}>{this.state.errMsg}</div>
							<div className={styles.formItem}>
								<input
									ref={this.username}
									type='text'
									placeholder='Email'
								/>
							</div>
							<div className={styles.formItem}>
								<input
									ref={this.password}
									type='password'
									placeholder='Password'
									onKeyPress={this.handleEnter}
								/>
							</div>
							<div className={styles.formItem}>
								<ButtonBase
									disabled={this.state.loggingIn}
									onClick={this.execLogin}
									className={this.state.loggingIn ? styles.loginButton_disabled : styles.loginButton}
								>
									{this.state.loggingIn ? 'Logging In ...' : 'Log In'}
								</ButtonBase>
							</div>
							<div className={styles.literature}>
								<b>Admin Login</b>, please click <Button style={{ color: '#007BB6', textTransform: 'initial' }} onClick={this.adminLogin}> here</Button>
								{/* <br />
								If you want to register an <b>advisor</b>, please click  <Button style={{ color: '#007BB6', textTransform: 'initial' }} onClick={this.advisorRegistration}> here</Button> */}
							</div>
						</div>
					)}
				</div>
				<div className={styles.loginFooterSection}>
					<div>
						<div>
							&copy; {new Date().getFullYear()} RadBid
						</div>
					</div>
				</div>
			</div>
		);
	}
}
