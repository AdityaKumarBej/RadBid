import React, { Component } from 'react';
import { Paper, Divider, ButtonBase } from '@material-ui/core';

import styles from './ContentContainer.module.css';

export default class ContentContainer extends Component {
	constructor(props) {
		super(props);
		this.customRefs = {};
	}


	buildHeaderAction = (input, index) => {
		const style = this.props.headerBtnStyle ? this.props.headerBtnStyle : { backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }
		if (input.label) {
			return (
				<div key={'div' + index}>
					<ButtonBase
						className={styles.btnStyle}
						key={index}
						style={style}
						onClick={input.handler}
					>
						{input.label}
					</ButtonBase>
				</div>
			);
		}
	};


	render() {
		let headerActions = [];

		if (this.props.headerActions) {
			this.props.headerActions.forEach((action, index) => {
				if (action && action.label) {
					headerActions.push(this.buildHeaderAction(action, index));
				}
			});
		}
		return (
			<Paper
				className={styles.contentContainer}
				style={{
					minWidth: this.props.minWidth ? this.props.minWidth : '300px',
					maxWidth: this.props.maxWidth ? this.props.maxWidth : undefined,
					width: this.props.width ? this.props.width : undefined,
					height: this.props.height ? this.props.height : undefined,
					marginTop: this.props.marginTop ? this.props.marginTop : undefined,
					backgroundColor: '#F7F8FA',
					boxShadow: 'none',
					display: this.props.display ? this.props.display : undefined
				}}
			>

				{
					(this.props.headingOn === "true"		//redundant piece of code, remove later
						?
						<div className={styles.heading}>
							{this.props.heading}
							<div style={{ float: 'right', display: 'inline-flex' }}>{headerActions}</div>
						</div>
						:
						" ")
				}

				<Divider />
				<div id='renderSection' className={styles.renderSection}></div>
				{this.props.children}
			</Paper>
		);
	}
}
