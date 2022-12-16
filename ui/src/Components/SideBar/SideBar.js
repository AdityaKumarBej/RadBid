import React, { Component } from 'react';
import styles from './Sidebar.module.css';
import { UI_CONTEXT_ROOT } from '../../GlobalConfig';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import Hamburger from 'hamburger-react'
import Link from 'next/link';

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			count: 1,
			pagePath: undefined,
			isOpen: true
		};
	}

	componentDidMount() {
		this.setState({
			pathName: `/${window.location.pathname.split('/')[1]}/${window.location.pathname.split('/')[2]}`,
		});
	}
	//componentDidMount() { this.setState({ pathName: window.location.pathname }) }
	/*componentDidUpdate() {this.setState({pathWay:window.location.pathname})}*/

	setOpen = () => {
		this.setState({ count: this.state.count * -1, isOpen: !this.state.isOpen });
	}
	render() {
		const SidebarData = [
			{
				title: 'Home',
				icon: <GridViewOutlinedIcon />,
				link: '/dashboard',
			},
			{
				title: 'Auctions',
				icon: <GroupOutlinedIcon />,
				link: '/auctions',
			},
			{
				title: 'Users',
				icon: <PlayCircleFilledWhiteOutlinedIcon />,
				link: '/users',
			},
			{
				title: 'Integrations',
				icon: <ElectricBoltOutlinedIcon />,
				link: '/integrations',
			},
		];

		return (
			<div className={this.state.count < 0 ? styles.inactive : styles.sideBar}>
				<div className={styles.top_section}>
					<div className={styles.logo}></div>
					<div onClick={() => this.setState({ count: this.state.count * -1 })} className={styles.back_arrow}>
						{/* {this.state.count < 0 ? <ArrowCircleRightOutlinedIcon /> : <ArrowCircleLeftOutlinedIcon />} */}
						<Hamburger toggled={this.state.isOpen} toggle={this.setOpen} size={20} />
					</div>



				</div>
				<ul className={styles.sideBarList}>
					{SidebarData.map((val, key) => {
						return (
							<Link href={`${val.link}`}>
								<li
									key={key}
									className={styles.row}
									id={
										this.state.pathName === `${UI_CONTEXT_ROOT}${val.link}`
											? styles.rowactive
											: 'notactive'
									}
								>
									{' '}
									<div className={styles.icon}>
										<span>{val.icon}</span>
									</div>
									<div className={this.state.count < 0 ? styles.inactiveTitle : styles.title}>
										<span>{val.title}</span>
									</div>
								</li>
							</Link>
						);
					})}
				</ul>


				{/* 					AVATAR AND NAME DISPLAY IN SIDEBAR
				<div className={this.state.count < 0 ? styles.inactivesideFooter : styles.sideFooter}>
					<div className={styles.avatar}>
						<img src='/avatar.png' alt='user' />
					</div>
					<div className={this.state.count < 0 ? styles.inactiveUserinfo : styles.userinfo}>
						<h5>{this.props.userName}</h5>
					</div>
				</div> */}
			</div>
		);
	}
}
