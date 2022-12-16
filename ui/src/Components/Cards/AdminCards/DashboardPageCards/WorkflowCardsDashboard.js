import React, { Component } from 'react';
import styles from './WorkflowCardsDashboard.module.css';

export class ActiveWorkflowsCard extends Component {
	constructor(props) {
		super(props);
		this.setState = {};
	}
	render() {
		//console.log("checking props", this.props.index)
		return (
			<div className={styles.cardActiveWorkflowCard} key={this.props.index}>
				<div className={styles.cardContentActiveWorkflowCard}>
					<table style={{ width: '250%' }}>
						<tbody>
							<tr>
								<td>
									<div
										style={{
											fontSize: '13px',
											fontWeight: 'bolder',
											textAlign: 'left',
											marginLeft: '10px',
											color: '#009900',
											backgroundColor: '',
										}}
									>
										{this.props.status}
									</div>
								</td>
								<td>
									<div
										className={styles.workflowPublishedAt}
									>
										<b>{this.props.publishedAt}</b>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<br />
					<div
						className={styles.workflowTitle}
					// style={{ fontSize: '20px', fontWeight: 'bolder', marginTop: '', marginLeft: '10px' }}
					>
						{this.props.title}
					</div>
					<br />
					<br />
					<table
						style={{
							width: this.props.status == 'Draft' ? '160%' : '160%',
							maxWidth: '',
							marginLeft: '10px',
							position: 'relative',
							bottom: '-42px',
							// tableLayout: 'fixed',
							width: '533px'
						}}
					>
						<tr className={styles.workflowStats}>
							<th>{this.props.bidders}</th>
							{/* <th>{this.props.completed}</th> */}
							<th>{this.props.LatestBidPrice}</th>
							{/* <th>{this.props.ExitedEarly}</th> */}
						</tr>
						<tr className={styles.workflowStatsStatus}>
							<td>Bidders</td>
							{/* <td>completed</td> */}
							<td>Latest Bid Price</td>
							{/* <td>Latest Bid Price</td> */}
						</tr>
					</table>
				</div>
			</div>
		);
	}
}
export class WorkflowCardsDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			noOfCard: 3,
			slice: this.props.cards.slice(0, 3),
		};
	}

	componentDidMount() {
		console.log("activating");
		console.log("the active workflow cards are", this.props.cards);
	}



	render() {
		return (
			<div className={styles.cardsContainerActiveWorkflowCardforDashboard}>
				{this.props.cards.length > 0
					?
					(
						this.props.cards.slice(0, 2).map((card) => (
							<ActiveWorkflowsCard
								title={card.title}
								index={card.id}
								status={card.status}
								publishedAt={card.publishedAt}
								TimeStatus={card.TimeStatus}
								DateStatus={card.DateStatus}
								bidders={card.StatusData.started}
								LatestBidPrice={card.StatusData.LatestBidPrice}


								completed={card.StatusData.Completed}
								ExitedEarly={card.StatusData.ExitedEarly}
								start={this.props.start}
								Edit={this.props.Edit}
								Delete={this.props.Delete}
								Pause={this.props.Pause}
							/>
						))
					) :
					(
						<h3 className={styles.noActiveWorkflowsFoundText}>No recent auctions found</h3>
					)}
			</div>
		);
	}
}
