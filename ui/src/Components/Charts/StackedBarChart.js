import React, { Component } from 'react';
import { Chart } from 'react-chartjs-2';

export default class StackedBarChart extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const data = {
			labels: this.props.engagementChartLabels,

			datasets: [
				{
					label: 'Idle',
					data: this.props.idleDataSet,
					backgroundColor: [
						'rgba(255, 203, 168, 1)',
						'rgba(255, 203, 168, 1)',
						'rgba(255, 203, 168, 1)',
						'rgba(255, 203, 168, 1)',
						'rgba(255, 203, 168, 1)',
						'rgba(255, 203, 168, 1)',
						'rgba(255, 203, 168, 1)',
					],
					borderWidth: 0.5,
				},
				{
					label: 'Moderately Engaged',
					data: this.props.moderatelyEngagedDataSet,
					backgroundColor: [
						'rgba(142, 220, 181, 1)',
						'rgba(142, 220, 181, 1)',
						'rgba(142, 220, 181, 1)',
						'rgba(142, 220, 181, 1)',
						'rgba(142, 220, 181, 1)',
						'rgba(142, 220, 181, 1)',
						'rgba(142, 220, 181, 1)',
					],
					borderWidth: 0.5,
				},
				{
					label: 'Highly Engaged',
					data: this.props.highlyEngagedDataSet,
					backgroundColor: [
						'rgba(58, 180, 119, 1)',
						'rgba(58, 180, 119, 1)',
						'rgba(58, 180, 119, 1)',
						'rgba(58, 180, 119, 1)',
						'rgba(58, 180, 119, 1)',
						'rgba(58, 180, 119, 1)',
						'rgba(58, 180, 119, 1)',
					],
					borderWidth: 0.5,
				},
			],
		};

		return (
			// <div style={{ width: '100%', height: '100%' }}>
			<Chart
				type='bar'
				data={data}
				options={{
					maintainAspectRatio: false,
					scales: {
						x: {
							stacked: true,
							title: {
								display: true,
								text: 'Days',
								font: {
									size: 14,
								}
							},
						},
						y: {
							stacked: true
							,
							title: {
								display: true,
								text: 'Number of contacts',
								font: {
									size: 14,
								}
							},
						},


					},
					plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: true } } },
				}}
			/>
			// </div>
		);
	}
}
