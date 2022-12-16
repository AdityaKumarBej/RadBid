import React, { Component } from 'react';
import styles from './TotalActionsRank.module.css'

export default class Total_Rank extends React.Component {
	render() {
		return (
			<div className={styles.card} style={{ margin: '1em' }}>
				{/* <img src={this.props.img} /> */}
				<div className='card-body'>
					<div style={{ "display": "flex" }}>
						<sup style={{ "fontSize": "16px" }}>{this.props.latestactivity[0].title_1}</sup>&nbsp;&nbsp;<h3 style={{ "fontSize": "40px", "font-weight": 700, "margin": "0px" }}>{this.props.latestactivity[0].title_2}</h3>
					</div>

					<p>You’re ranked in the Top 26% Advisors based on your Growth Station’s performance.</p>
					{/* <h5>{this.props.author}</h5> */}
				</div>
			</div>
		);
	}
}
