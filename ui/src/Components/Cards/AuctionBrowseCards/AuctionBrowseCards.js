import React, { Component } from 'react';
import styles from './AuctionBrowseCards.module.css';
import { TextField } from '@material-ui/core';
import Avatar from '@mui/material/Avatar';


export class ExploreTabCardContainer extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={styles.cardsContainerExploreTab}>
				{this.props.cards.map((card) => (
					<div
						className={styles.cardExploreTab}
						id={card.content}
					// onClick={() => this.props.handler(card.title, card.content)}

					>
						<div className={styles.cardContent}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>{card.logo}</div>
								<div style={{ height: '2%', marginTop: '2%', fontFamily: 'sans-serif', background: '#ECF7FF', borderRadius: '4px', padding: '6px', color: '#007BB6', fontSize: '12px', fontWeight: '600' }}>{card.status}</div>
							</div>
							<h3 style={{ color: '#50555C', fontSize: '18px', fontWeight: '700', fontFamily: 'sans-serif', opacity: '0.9' }}>
								{card.title}
							</h3>
							<p style={{ fontSize: '14px', fontWeight: '400', fontFamily: 'sans-serif', opacity: '0.5', color: '#9398A3' }}>
								{card.content}
							</p>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default class ExpolreTabCards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			dialogTitle: '',
			filterTemplates: [],
			cardsData: [
				{
					id: 1,
					title: 'Chalice',
					content: 'Description of item',
					// status: '+7 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/AdvisorStream.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />

				},
				{
					id: 2,
					title: 'Crown',
					content: 'Description of Item',
					// status: '+2 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/test.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />


				},
				{
					id: 2,
					title: 'Shirt',
					content: 'Description of Item',
					// status: '+2 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/test.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />


				},
				{
					id: 2,
					title: 'Gold',
					content: 'Description of Item',
					// status: '+2 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/test.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />


				},
				{
					id: 2,
					title: 'House',
					content: 'Description of Item',
					// status: '+2 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/test.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />


				},
				{
					id: 2,
					title: 'Camera',
					content: 'Description of Item',
					// status: '+2 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/test.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />


				},
				{
					id: 2,
					title: 'Building',
					content: 'Description of Item',
					// status: '+2 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/test.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />


				},
				{
					id: 2,
					title: 'Antique',
					content: 'Description of Item',
					// status: '+2 INSTALLS',
					logo: <Avatar alt="Remy Sharp" src="/test.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />


				},
			],
			selectedFilter: 'popularTemplates'
		};
	}
	buildInputField = (label, name, type, required, disabled, fullWidth) => {
		return (
			<TextField
				key={name}
				type={type}
				value={this.state[name]}
				name={name}
				label={label}
				required={required ? required : false}
				disabled={disabled ? disabled : false}
				onChange={this.setValue}
				fullWidth={fullWidth ? fullWidth : false}
				InputLabelProps={{ style: { fontSize: 14 }, shrink: true }}
				size='small'
				variant='outlined'
			/>
		);
	};
	setValue = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	AllTemplate = () => {
		this.setState({ filterTemplates: [], searchTemplate: '' });
	};
	filterSearch = () => {
		const filterNurture = this.state.cardsData.filter((template) =>
			template.title
				.split(' ')
				.join('')
				.trim()
				.toUpperCase()
				.includes(this.state.searchTemplate.split(' ').join('').trim().toUpperCase()),
		);
		this.setState({ filterTemplates: filterNurture, selectedFilter: 'popularTemplates' });
	};
	filterNurture = () => {
		const filterNurture = this.state.cardsData.filter((template) =>
			template.title.includes('Nurture relationships'),
		);
		this.setState({ filterTemplates: filterNurture, searchTemplate: '', selectedFilter: 'nurture' });
	};
	filterReengage = () => {
		const filterNurture = this.state.cardsData.filter((template) => template.title.includes('Re-engage'));
		this.setState({ filterTemplates: filterNurture, searchTemplate: '', selectedFilter: 'reengage' });
	};
	filterUpdate = () => {
		const filterNurture = this.state.cardsData.filter((template) => template.title.includes('Update'));
		this.setState({ filterTemplates: filterNurture, searchTemplate: '', selectedFilter: 'update' });
	};
	filterShareInformation = () => {
		const filterNurture = this.state.cardsData.filter((template) => template.title.includes('Share Information'));
		this.setState({ filterTemplates: filterNurture, searchTemplate: '', selectedFilter: 'shareInformation' });
	};
	render() {
		return (
			<div className={styles.containerExploreTab}>
				<div style={{ textAlign: 'right', overflow: 'hidden', padding: '10px', position: 'relative', left: '-28px' }}>

				<button
					    className={styles.Btn}
						onClick={this.AllTemplate}
						>
						All categories
					</button>

                    <button
					    className={styles.Btn}
					    onClick={this.AllTemplate}
					>
						Antique
					</button>

                    <button
					    className={styles.Btn}
					    onClick={this.filterNurture}
					>
						Valuables
					</button>

                   <button
					    className={styles.Btn}
					    onClick={this.filterReengage}
					>
						Real Estate
					</button>

                   <button
					    className={styles.Btn}
					    onClick={this.filterShareInformation}
					>
						NFTs
					</button>
					

                   <div  style={{ float: 'right', marginRight: '10px', marginTop: '2px' }}>
                        <button
						    className={styles.Btn}
							style={{width:'max-content',borderRadius:'15px'}}
						    onClick={this.filterSearch}
						>
							Search
						</button>

						<div style={{ float: 'right', marginLeft: '10px' }}>
							{this.buildInputField('Search', 'searchTemplate', 'text', true, false, false)}
						</div>
					</div>
				</div>
				<div>
					<ExploreTabCardContainer
						cards={
							this.state.filterTemplates.length > 0 ? this.state.filterTemplates : this.state.cardsData
						}
					// handler={this.props.handler}
					/>
				</div>
			</div>
		);
	}
}




//Draft IntegrationTab cards--->
export class IntegrationTabCard extends Component {
	constructor(props) {
		super(props);
		this.setState = {};
	}

	render() {
		return (
			<div className={styles.cardIntegrationTabCard} key={this.props.index}>
				<div className={styles.cardContentIntegrationTabCard}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div>{this.props.logo}</div>
						<div style={{ height: '2%', marginTop: '2%', fontFamily: 'sans-serif', background: '#EBFBF3', borderRadius: '4px', padding: '6px', color: '#006F2A', fontSize: '12px', fontWeight: '600', marginLeft: '180%' }}>{this.props.status}</div>
					</div>
					<br />
					<div style={{ fontSize: '20px', fontWeight: 'bolder', marginTop: '-6%' }}>
						<p style={{ fontFamily: 'Open Sans', fontWeight: '700', fontSize: '18px', color: '#50555C' }}>{this.props.title}</p>
					</div>
					<div>
						<p className={styles.integrationTabContent} >{this.props.content}</p>
					</div>
				</div>
			</div>
		);
	}
}


export class AuctionsTabCardContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			noOfCard: 3,

		};
	}
	render() {

		return (
			<div className={styles.cardsContainerExploreTabCards}>
				{this.props.cards.map((card) => (

					<IntegrationTabCard
						title={card.title}
						index={card.id}
						status={card.status}
						content={card.content}
						logo={card.logo}
					/>

				))}
			</div>
		);

	}
}
