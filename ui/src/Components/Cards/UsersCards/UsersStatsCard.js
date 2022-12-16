import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ButtonBase, CardActionArea } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

export default class MyContactsStatsCard extends Component {
	constructor(props) {
		super(props);
	}


	render() {
		const CardData = [
			{
				title: this.props.totalContacts,
				text: 'Total Users',
				icon: <InfoOutlinedIcon style={{ fontSize: '129%' }} />,
				info: 'Total number of users registered in RadBid.'
			},
			{
				title: this.props.totalContactsInWorkflow,
				text: 'In Auction',
				icon: <InfoOutlinedIcon style={{ fontSize: '129%' }} />,
				info: 'Number of contacts currently part of any active auction.'
			},
			{
				title: this.props.totalContactsIdle,
				text: 'Idle',
				icon: <InfoOutlinedIcon style={{ fontSize: '129%' }} />,
				info: 'Number of contacts not currently part of any active auction.'
			},
			{
				title: this.props.totalContactsNeverInWorkflow,
				text: 'Never in auction',
				icon: <InfoOutlinedIcon style={{ fontSize: '129%' }} />,
				info: 'Number of contacts who have never been part of any auction ever.'
			},
		];

		return (
			<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} style={{ ...this.props.style }}>
				{CardData.map((val, key) => {
					return (
						<Grid item xs={3}>
							<Card sx={{ maxWidth: 245, maxHeight: 130 }} key={key} style={{ justifyContent: 'left', boxShadow: 'rgb(9 30 66 / 25%) 0px 4px 8px -2px, rgb(9 30 66 / 8%) 0px 0px 0px 1px' }}>
								<CardContent>
									<Typography gutterBottom variant='h5' component='div'>
										<div style={{ fontFamily: '#1E1F21', fontWeight: '700', fontSize: '48px' }}>{val.title}</div>
									</Typography>
									<div style={{ display: 'flex', gap: '6px', fontFamily: 'Open Sans', fontWeight: '600', fontSize: '16px', color: '#50555C' }}>
										<div>
											<Typography variant='body2' color='text.secondary'>
												{val.text}
											</Typography>
										</div>
										<div>
											<Tooltip title={val.info}>
												{val.icon}
											</Tooltip>
										</div>

									</div>
								</CardContent>
							</Card>
						</Grid>
					);
				})}
			</Grid>
		);
	}
}
