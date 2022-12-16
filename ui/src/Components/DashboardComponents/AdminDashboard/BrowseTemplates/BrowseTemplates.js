import React, { useState, useEffect } from 'react';
import styles from './BrowseTemplates.module.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import { WorkflowCardsDashboard } from '../../../Cards/AdminCards/DashboardPageCards/WorkflowCardsDashboard';
// const api = require('../../../../api/campaignManager');

export default function BrowseTemplates(props) {
	const [latestActiveWorkflows, setLatestActiveWorkflows] = useState([]);

	useEffect(() => {

		let reqConfig = {
			// headers: {
			// 	'x-gs-domain': profile.domain,
			// 	'x-gs-user': profile.username
			// }
		}

		populateWorkflowData(reqConfig);

	}, []);


	const populateWorkflowData = async (reqConfig) => {
		let activeCampaignInstances = [
			{
				id: 0, //uid should be the campaign instance ID
				campaign_id: 1,
				status: 'ACTIVE',             //hardcoded to turned on always
				published_at: '01/01/2022',
				title: 'Auction 1',
				StatusData: {
					bidders: 10,
					Completed: 10,
					latest_bid_price: 10,
					CompletedGoalAchieved: 10,
					CompletedGoalNotAchieved: 10,
					ExitedEarly: 102
				}
			},
			{
				id: 1, //uid should be the campaign instance ID
				campaign_id: 2,
				status: 'ACTIVE',             //hardcoded to turned on always
				published_at: '01/01/2022',
				title: 'Auction 2',
				StatusData: {
					bidders: "10",
					Completed: 10,
					latest_bid_price: 10,
					CompletedGoalAchieved: 10,
					CompletedGoalNotAchieved: 10,
					ExitedEarly: 102
				}
			}
		]
		 
		//  await api.getCampaignInstancesByState("active", reqConfig);
		let activeCampaignInstanceLength = Object.keys(activeCampaignInstances).length

		console.log("checking length", activeCampaignInstanceLength)
		if (activeCampaignInstanceLength === 0) {
			console.log("No active auctions found");
		}
		else {

			let count = 0;

			console.log('total number of active campaigns - ', activeCampaignInstanceLength);
			//iterate every campaign instance
			for (var i = activeCampaignInstanceLength-1; i >= 0; i--) {
				count++;
				if (count > 2) {
					break;			//we only need recent 2 campaign instances for the dashboard
				}
				let current_campaign_instance_id = activeCampaignInstances[i].uid;
				let current_campaign_id = activeCampaignInstances[i].campaign_id;
				console.log("the campaign instance of uid", current_campaign_instance_id, "was generated from campaign id", current_campaign_id);


				let timestamp = new Date(activeCampaignInstances[i].published_at).toISOString().replace(/([^T]+)T([^\.]+).*/g, '$1 $2');
				//use the campaign_id to get details such as name of the campaign which is not available in campaign instance schema
				// let campaignObj = await api.getCampaign(current_campaign_id, reqConfig);

				// console.log("printing campaign names", campaignObj.name);

				let tempActiveCampaignObj = {
					id: activeCampaignInstances[i].id, //uid should be the campaign instance ID
					campaign_id: activeCampaignInstances[i].campaign_id,
					status: activeCampaignInstances[i].status,             //hardcoded to turned on always
					publishedAt: activeCampaignInstances[i].published_at,
					title: activeCampaignInstances[i].title
				};
				tempActiveCampaignObj["StatusData"] = {
					started: activeCampaignInstances[i].StatusData.bidders,
					LatestBidPrice: activeCampaignInstances[i].StatusData.latest_bid_price,

					Completed: activeCampaignInstances[i].StatusData.Completed,
					CompletedGoalAchieved: activeCampaignInstances[i].StatusData.CompletedGoalAchieved,
					CompletedGoalNotAchieved: activeCampaignInstances[i].StatusData.CompletedGoalNotAchieved,
					ExitedEarly: activeCampaignInstances[i].StatusData.ExitedEarly,
				}
				console.log("main check", tempActiveCampaignObj)
				setLatestActiveWorkflows((data) => [...data, tempActiveCampaignObj]);

			}
		}
	}

	return (
		<div className={styles.content}>

			<WorkflowCardsDashboard cards={latestActiveWorkflows} />

			<Box sx={{ width: 427, height: 100 }} className={styles.box}>
				<Typography
					variant='h2'
					component='div'
					sx={{ fontSize: 20, fontWeight: 700, color: 'rgba(0, 163,214, 1)' }}
					className={styles.text - 1}
				>
					You can view all active auctions in the Auctions page. Ensure you have no pending auctions
					left for approval
					
				</Typography>
			</Box>

			<Box sx={{ width: 280, height: 40 }} style={{ position: 'absolute', top: '345px', right: '-90px', display: 'flex' }}>
				<Link href='/automations'>
					<Button
						style={{ position: 'relative', left: '-98px', backgroundColor: 'transparent' }}>
						<Typography variant='h5' component='div'
							sx={{ fontSize: 14, fontWeight: 600, color: '#00578E', position: 'relative', textTransform: 'none' }}>
							Unapproved auctions
						</Typography>
						<div className={styles.gg_arrow_long_right}>
						</div>
					</Button>
				</Link>
			</Box>
		</div>
	);
}