import React, { Component } from 'react';
import { Paper, Tab, Tabs } from '@mui/material';

export default class TabbedWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentIdx: this.props.tabIndex || 0,
		};
	}

	componentDidMount = () => {
		if (this.props.resumeIdx) {
			this.changeTab(this.props.resumeIdx);
		}
	};

	handleChangeIdx = (event, value) => {
		this.setState({ currentIdx: value });
	};

	changeTab = (tabIndex) => {
		this.setState({ currentIdx: tabIndex });
	};

	getCurrentTabIndex = () => {
		return this.state.currentIdx;
	};

	buildTabLabels = (tabs) => {
		let labels = [];

		tabs.forEach((tab, ind) => {
			let tabLabel;
			const tabStyle = this.props.styledTabs ? {
				width: "102px",
				height: "24px",
				marginRight: "24px",
				textTransform: 'initial',
				fontStyle: "normal",
				fontWeight: "600",
				fontSize: "16px",
				lineHeight: "150%",
				textAlign: "right",
				letterSpacing: "0.01em",
				color: ind == this.state.currentIdx ? "#00578E" : "#50555C",
			}
				: {
					textTransform: 'initial', fontWeight: '400', fontFamily: 'sans-serif'
				}
			if (tab.count) {
				tabLabel = (
					<Tab
						style={tabStyle}
						label={`${tab.label} (${tab.count})`}
						key={`${tab.label}`}
					/>
				);
			} else {
				tabLabel = (
					<Tab
						style={tabStyle}
						label={`${tab.label}`}
						key={`${tab.label}`}
					/>
				);
			}
			labels.push(tabLabel);
		});
		return labels;
	};

	render() {
		return (
			<div className='tabbedWidget' style={{ width: this.props.width ? this.props.width : '100%', position: this.props.position, bottom: this.props.bottom }}>
				{this.props.styledTabs ?
					<Tabs value={this.state.currentIdx} onChange={this.handleChangeIdx} TabIndicatorProps={{ style: { color: '#00578E', background: '#00578E' } }}>
						{this.buildTabLabels(this.props.tabLabels)}
					</Tabs> :
					<Paper square style={{ backgroundColor: '#f9f9f9' }}>
						<Tabs value={this.state.currentIdx} onChange={this.handleChangeIdx}>
							{this.buildTabLabels(this.props.tabLabels)}
						</Tabs>
					</Paper>
				}

				{this.props.children[this.state.currentIdx]}
			</div>
		);
	}
}
