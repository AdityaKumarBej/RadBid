import React, { Component } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Sidebar from '../SideBar/SideBar';
import styles from './Layout.module.css';

export default class Layout extends Component {
	constructor(props) {
		super(props);
        this.state = {
			userName: "John Doe"
		};
	}

	componentDidMount() {
		// let userName = sessionStorage.getItem('entityName').toString();
		// console.log('checking username', userName);
		// this.setState({ userName: userName });
	}
	render() {
		return (
			<div style={{ width: '100%', height: ' 100%' }}>
				<Header />

				<div id='masterRenderContainer' className={styles.masterRenderContainer}>
					<Sidebar className={styles.masterRenderContainerChildSideBar} userName={this.state.userName} />
					<div id='masterRenderTargets' className={styles.masterRenderContainerChildContent}>
						{this.props.children}
					</div>
				</div>
				{/* <Footer /> */}
			</div>
		);
	}
}
