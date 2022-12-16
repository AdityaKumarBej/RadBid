import React, { Component, useState, useEffect } from 'react';
import Layout from '../src/Components/Layout/Layout';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { IconButton } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { Paper, Divider, ButtonBase, Container, Grid, Button } from '@material-ui/core';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import styles from './AdminDashboard.module.css';
import PieChart from '../src/Components/Charts/PieChart';
import { Close, InfoOutlined } from '@mui/icons-material';

import PendingActions from '../src/Components/DashboardComponents/AdminDashboard/PendingActions'
import { UserActiviityList } from '../src/Components/DashboardComponents/AdminDashboard/UserActivity/UserActivityList';
import BrowseTemplates from '../src/Components/DashboardComponents/AdminDashboard/BrowseTemplates/BrowseTemplates';
import { ReactCard } from '../src/Components/DashboardComponents/AdminDashboard/ReactCardTemplate';
import { styled } from '@mui/material/styles';
import { PageLoader } from '../src/Components/Loader/Loader';
// const api = require('../api/campaignManager');
const _ = require('lodash');


export default function Dashboard(props) {
	const [Trigger, setTrigger] = useState(false);
	const [profile, setProfile] = useState(undefined);
	const [user, setUser] = useState('John Doe');
	const [pendingActionsCount, setPendingActionsCount] = useState(0);
	const [pendingActionsData, setPendingActionsData] = useState([]);
	const [UserActivityData, setUserActivityData] = useState([]);
	const [noActivityHistoryFound, setNoActivityHistoryFound] = useState(false);
	const [totalActionsData, setTotalActionsData] = useState({
		id: '1',
		title_1: `0`,
		// title_2: `${percentage_increase}%`,
		title_2: `0%`,
		sub_title: 'Total actions have been performed on your behalf by the Growth Station since last week.',
		content: (0 > 0) ? `${0}% of these actions had a positive impact.` : `No actions have been performed`,
	});
	const [ContactsData, setContactsData] = useState([]);
	const [engagement_breakdown, setEngagementBreakdown] = useState([]);
	const [reqConfig, setReqConfig] = useState({});
	const [loading, setLoading] = useState(false)
	const [showAlert, setShowAlert] = useState(false);
	const [engagementDataSet, setEngagementDataSet] = useState([]);
	const [engagementDataAvailable, setEngagementDataAvailable] = useState(false);

	useEffect(async () => {

		let profile = JSON.parse(sessionStorage.getItem("profile"))
		let reqConfig = JSON.parse(sessionStorage.getItem("reqConfig"));

		setReqConfig(reqConfig);
		setUser(profile.name);
		setProfile(profile);
		populatePageData(reqConfig);
	}, []);

	const populatePageData = async (reqConfig) => {
		// setLoading(true)

		let count = 0;

		console.log("populating dashboard page data");


		/********pending actions data */
		// let open_tasks = await api.getUserTasks("open", reqConfig);
        let open_tasks = [
            {
                uid:0,
                description: {
                    taskTitle: "Auction 1 has started",
                    taskDescription: "Desc"
                },
                related_contact:{
                    contactName: 'Bob'
                },
                created_at:'12/12/2022'
            },
            {
                uid:1,
                description: {
                    taskTitle: "Auction 2 has ended",
                    taskDescription: "Desc"
                },
                related_contact:{
                    contactName: 'Alice'
                },
                created_at:'12/12/2022'
            }
        ]
           
        
		console.log("the open tasks of the advisor are", open_tasks);
		console.log("the open tasks length of the advisor are", open_tasks.length);
		setPendingActionsCount(open_tasks.length); 	//set count of pending actions

		let temp_tasks_array = [];

		for (var i = 0; i < open_tasks.length; i++) {
			let temp_task_obj = {};

			/**remove this as soon as Eoin sends the title in the title key */
			let parsedObject = JSON.parse(open_tasks[i].description);
			let title = parsedObject.taskTitle;
			let description = parsedObject.taskDescription;
			/**remove this as soon as Eoin sends the title in the title key */

			/**fetch the contact name */
			let contact_name = open_tasks[i].related_contact.contactName





			/**Campaign,Campaign-uid and Campaign instanceId  - Eoin to implement this in the server */
			let campaign_name = "placeholder_text";
			let campaign_uid = "2";
			let campaign_instance_uid = "1";

			/**modify the timestamp */
			let time = new Date(open_tasks[i].created_at).toISOString().replace(/([^T]+)T([^\.]+).*/g, '$1 $2')

			temp_task_obj["icon"] = <DescriptionOutlinedIcon />;
			temp_task_obj["title"] = title;
			//temp_task_obj["text"] = `You have an open task ${description} for your contact ${contact_name} in campaign ${campaign_name}`;
			temp_task_obj["text"] = `You have an open task ${description} for your contact ${contact_name}`;
			temp_task_obj["name"] = `${contact_name}`;
			temp_task_obj["description"] = `${description}`;
			temp_task_obj["campaign_name"] = `${campaign_name}`;
			temp_task_obj["campaign_uid"] = `${campaign_uid}`;
			temp_task_obj["campaign_instance_uid"] = `${campaign_instance_uid}`;
			temp_task_obj["priority"] = "HIGH PRIORITTY";
			temp_task_obj["time"] = time;
			temp_task_obj["contact_id"] = open_tasks[i].related_contact;
			temp_task_obj["uid"] = open_tasks[i].uid;


			//include campaign name as part of this
			temp_tasks_array.push(temp_task_obj);
		}

		//console.log("the temp tasks array is", temp_tasks_array);

		setPendingActionsData(temp_tasks_array);


		/*Total Actions Data*/

		// let activityHistoryResponse = await api.getActivityHistory("weekly", reqConfig);
        let activityHistoryResponse = [
            {
                total: 100,
                outbound: 20,
                successful_actions_on_users_behalf: 10
            }
        ]
		let total_actions_overall = 0;
		let total_outbound_actions = 0;
		let successfull_actions_on_users_behalf = 0;

		for (var i = 0; i < Object.keys(activityHistoryResponse).length; i++) {
			total_actions_overall += activityHistoryResponse[i].total;
			total_outbound_actions += activityHistoryResponse[i].outbound;
			successfull_actions_on_users_behalf += activityHistoryResponse[i].successful_actions_on_users_behalf;
		}
		let positive_actions = 0;
		if (total_actions_overall > 0) {
			positive_actions = Math.round((successfull_actions_on_users_behalf * 100) / total_actions_overall)
		}
		let current_week_outbound_total = activityHistoryResponse[0].outbound;
		let previous_week_outbound_total = activityHistoryResponse[1].outbound;

		let percentage_increase = current_week_outbound_total;

		if (previous_week_outbound_total > 0) {
			percentage_increase = Math.round((((current_week_outbound_total - previous_week_outbound_total) / previous_week_outbound_total) * 100), 2);
		}


		setTotalActionsData(
			{
				id: '1',
				title_1: `${total_outbound_actions}`,
				title_2: `${percentage_increase}%`,
				sub_title: 'Total actions have been performed on your behalf by the Growth Station since last week.',
				content: (positive_actions > 0) ? `${positive_actions}% of these actions had a positive impact.` : `No actions have been performed`,
			}
		);


		/*Total Contacts Data*/
		//let contactHistoryResponse = await api.getContactHistory("daily", reqConfig);
        let contactHistoryResponse = [
            {
                new_contacts: 10,
                total_contacts: 100
            },
            {
                new_contacts: 5,
                total_contacts: 100
            }
        ]
		let today_contacts = contactHistoryResponse[0].new_contacts;	//the first element in the array response would always be of the current day
		let yesterdays_contacts = contactHistoryResponse[1].new_contacts;//the second element in the array response would give us the contacts added between yesterday and today
		let total_contacts = contactHistoryResponse[0].total_contacts;
		let growth_indicator = 0;

		if (total_contacts > 0) {
			growth_indicator = Math.round(100 * (today_contacts - yesterdays_contacts) / (total_contacts), 2);
		}


		setContactsData([
			{
				id: '1',
				title: `${today_contacts}`,
				//title: '+12',
				growth_indicator: `${growth_indicator} %`,	//100 * (today_contacts - yesterday_contacts)/yesterday_contacts
				sub_title: 'New Contacts since yesterday',
				content: 'All of these contacts have been uploaded by you.',
			},
			{
				id: '2',
				title: `${total_contacts}`,
				// title: '155',
				growth_indicator: '',
				sub_title: 'Total Contacts',
				content:
					`Your list of contacts has ${total_contacts - contactHistoryResponse[0].total_ever_active} contacts in Idle status. Why don't try re-engaging with them.`,
			},
		]);
		/*Engagement Breakdown*/
		// let contactHistoryObj = await api.getContactHistory("daily", reqConfig);
        let contactHistoryObj = [
            {
                total_contacts: 100,
                highly_engaged_contacts: 10,
                moderately_engaged_contacts: 20,
                idle_90d_contacts: 90
            }
        ]
		let totalContacts = contactHistoryObj[0].total_contacts; //first element corresponds to the latest date

		if (totalContacts > 0) {
			setEngagementDataAvailable(true);
			let highlyEngagedContacts = contactHistoryObj[0].highly_engaged_contacts;
			let moderatelyEngagedContacts = contactHistoryObj[0].moderately_engaged_contacts;
			let idleContacts = contactHistoryObj[0].idle_90d_contacts;


			let tempArr = [];

			let percentageOfHighlyEngaged = Math.round((Number(highlyEngagedContacts) / Number(totalContacts) * 100), 2);
			let percentageOfModeratelyEngagedContacts = Math.round((Number(moderatelyEngagedContacts) / Number(totalContacts) * 100), 2);
			let percentageOfIdleContacts = Math.round((Number(idleContacts) / Number(totalContacts) * 100), 2);



			console.log("checking 1", percentageOfHighlyEngaged);
			console.log("checking 2", percentageOfModeratelyEngagedContacts);
			console.log("checking 3", percentageOfIdleContacts);
			tempArr.push(percentageOfHighlyEngaged);
			tempArr.push(percentageOfModeratelyEngagedContacts);
			tempArr.push(percentageOfIdleContacts);


			console.log("TEMP ARRAY IS", tempArr);
			setEngagementDataSet(tempArr);

			setEngagementBreakdown([
				{ id: '1', Name: 'Highly engaged', Value: `${percentageOfHighlyEngaged}%` },
				{ id: '2', Name: 'Moderately engaged', Value: `${percentageOfModeratelyEngagedContacts}%` },
				{ id: '3', Name: 'Idle', Value: `${percentageOfIdleContacts}%` },
			]);
		} else {
			console.log("no contacts found for calculaing engagement status")
		}



		/****Activity History Summary */

		//set user actuvity data
		// setIsActivityHistoryLoading(true);
		// let recent_activity_list = await api.getRecentActivity(reqConfig);
		//console.log("the recent activity is", recent_activity_list);

		// console.log("recent activity list", recent_activity_list);
		// var nArray = [];
		// for (const [index, value] of recent_activity_list.entries()) {
		// 	if (value.action_type !== null && value.activity_code !== null && value.activity_supplement !== null) {
		// 		//console.log(index, "---------", value.start);
		// 		nArray.push(index);
		// 	}
		// }

		//console.log("Array of index of not null object", nArray);
		var dictionary = [];
		// for (const el of nArray) {
		// 	if (dictionary.at(-1) === undefined || dictionary.at(-1).start !== recent_activity_list[el].start) {
		// 		const obj = {
		// 			start: recent_activity_list[el].start, Data: [
		// 				{
		// 					activity_code: recent_activity_list[el].activity_code,
		// 					contacts: recent_activity_list[el].contacts,
		// 					campaign_instance_id: recent_activity_list[el].campaign_instance_id,
		// 					activity_supplement: recent_activity_list[el].activity_supplement,
		// 					end_timestamp: recent_activity_list[el].end
		// 				}
		// 			]
		// 		}
		// 		dictionary = [...dictionary, obj]
		// 	} else {
		// 		const obj = {
		// 			activity_code: recent_activity_list[el].activity_code,
		// 			contacts: recent_activity_list[el].contacts,
		// 			campaign_instance_id: recent_activity_list[el].campaign_instance_id,
		// 			activity_supplement: recent_activity_list[el].activity_supplement,
		// 			end_timestamp: recent_activity_list[el].end
		// 		}
		// 		dictionary.at(-1).Data.push(obj);
		// 	}
		// }
		// console.log("dict is", dictionary);

        dictionary = [
            {
                start: '12/12/2022',
                Data:[
                    {
                        contacts: [1],
                        contactsFirstName: ['Bob'],
                        contactsLastName: ['Iger'],
                        activity_code: 'rd.v1.auction_started',
                        activity_supplement: {
                            auctionName: 'Chalice',
                            auctionStartTime: '3:10 AM (UTC)',
                            final_price: '200 Dollars'
                        },
                        campaign_instance_id: 1
                    }
                ]
            },
            {   
                start: '12/12/2022',
                Data:[
                    {
                        contacts: [1,2],
                        contactsFirstName: ['Bob', 'Alex'],
                        contactsLastName: ['Iger', 'Tahoe'],
                        activity_code: 'rd.v1.auction_ended',
                        activity_supplement: {
                            auctionName: 'Malice',
                            auctionStartTime: '9:20 AM (UTC)',
                            final_price: '560 Dollars'
                        },
                        campaign_instance_id: 1
                    }
                ]
            },
            {   
                start: '12/12/2022',
                Data:[
                    {
                        contacts: [1,2,3],
                        contactsFirstName: ['Bob', 'Alex', 'Marshall'],
                        contactsLastName: ['Iger', 'Tahoe', 'Mathers'],
                        activity_code: 'rd.v1.auction_suspended',
                        activity_supplement: {
                            auctionName: 'Teeth',
                            auctionStartTime: '5:10 AM (UTC)',
                            final_price: '123 Dollars'
                        },
                        campaign_instance_id: 1
                    }
                ]
            },
            {   
                start: '12/12/2022',
                Data:[
                    {
                        contacts: [1,2,3,4],
                        contactsFirstName: ['Bob', 'Alex', 'Marshall', 'Jake'],
                        contactsLastName: ['Iger', 'Tahoe', 'Mathers', 'Gyllenhall'],
                        activity_code: 'rd.v1.auction_started',
                        activity_supplement: {
                            auctionName: 'Crown',
                            auctionStartTime: '4:20 AM (UTC)',
                            final_price: '123 Dollars'
                        },
                        campaign_instance_id: 1
                    }
                ]
            },
        ]

        let contact_info_obj_arr = [
            {
                uid:1 ,
                firstname: 'Bob',
                middleinitial: 'Check',
                lastname: 'Iger'
            },
            {
                uid:2 ,
                firstname: 'Alex',
                middleinitial: 'Merling',
                lastname: 'Tahoe'
            },
            {
                uid:3 ,
                firstname: 'Marshall',
                middleinitial: '',
                lastname: 'Mathers'
            },
            {
                uid:4 ,
                firstname: 'Jake',
                middleinitial: '',
                lastname: 'Gyllenhall'
            },
        ]

		let count_of_activities = 0;

		if (dictionary.length > 0) {
			// setActivityHistoryDataPresent(true);
			let activity_data = [];
			for (var i = 0; i < dictionary.length; i++) {
				let temp_obj = {};

				let iso_string_date = dictionary[i].start;
				let modified_date = new Date(iso_string_date).toISOString().replace(/([^T]+)T([^\.]+).*/g, '$1');
				temp_obj["date"] = modified_date;

				let temp_Data = [];


				for (var j = dictionary[i].Data.length - 1; j >= 0; j--) {
					count_of_activities++;
					if (count_of_activities > 4) {
						break;
					}

					let temp_Data_obj = {};
					temp_Data_obj["id"] = `${j}`

					let contacts_uid_array = dictionary[i].Data[j].contacts;
					let total_number_of_contacts_grouped_in_this_activity = contacts_uid_array.length;


					// let contact_info_obj = await api.getContactInfo(contacts_uid_array[0], "false", reqConfig);
                    

					let contact_first_name = dictionary[i].Data[j].contactsFirstName[0];        //we want only the first contact name, others will be "and n others"
					let contact_last_name = dictionary[i].Data[j].contactsLastName[0];
					let contact_full_name = dictionary[i].Data[j].contactsFirstName[0] + " " + contact_info_obj.middleinitial + " " +dictionary[i].Data[j].contactsLastName[0]
					let activity_description = dictionary[i].Data[j].activity_code;
					let activity_supplement = dictionary[i].Data[j].activity_supplement;
					let campaign_instance_id = dictionary[i].Data[j].campaign_instance_id;


					/**logic to include campaign name in the activity verbiage */
					// let campaign_instance_id_object = await api.getCampaignInstance(campaign_instance_id, reqConfig);
					// let campaign_id = campaign_instance_id_object.campaign_id;

					// let campaign_id_object = await api.getCampaign(campaign_id, reqConfig);
					// let campaign_name = campaign_id_object.name;
					/**logic to include campaign name in the activity verbiage */


					let starting_line = "";
					let first_contact_name = "";
					let first_contact_lastname = "";         //for avatar bubble
					let first_contact_fullname = "";
					let second_contact_name = "";
					let second_contact_lastname = "";    //for avatar bubble
					let second_contact_fullname = "";
					let third_contact_name = "";
					let third_contact_lastname = "";        //for avatar bubble
					let third_contact_fullname = "";

					temp_Data_obj["mapContact"] = []
					temp_Data_obj["mapContact"].push({ campaign_id: campaign_id, campaign_instance_id: campaign_instance_id, campaign_name: campaign_name })
                    
                    let auction_name = activity_supplement["auctionName"]
                    let product_price = activity_supplement["final_price"]
                    let auction_start_time = activity_supplement["auctionStartTime"]

					if (total_number_of_contacts_grouped_in_this_activity === 1) {
						if (activity_description === "rd.v1.auction_started") {
							starting_line = `${contact_full_name} has entered in the auction ${auction_name}`;
						} else if (activity_description === "rd.v1.auction_ended") {
							starting_line = `${contact_full_name} has finished the auction ${auction_name}. Final Selling price - ${product_price}`;
						} else {
							starting_line =`Auction - ${auction_name} has been suspended`
						}
						temp_Data_obj["mapContact"].push({ contactName: contact_full_name, contactId: contacts_uid_array[0] });
					} else if (total_number_of_contacts_grouped_in_this_activity > 1 && total_number_of_contacts_grouped_in_this_activity <= 3) {
						// let contact_info_obj_arr = [];

						// for (var c = 0; c < total_number_of_contacts_grouped_in_this_activity; c++) {
						// 	// let contact_info_obj = await api.getContactInfo(contacts_uid_array[c], "false", reqConfig);

						// 	contact_info_obj_arr.push(contact_info_obj);
						// }
						//now this contact info obj arr will either have details of 2 or 3 contacts in it

						if (contact_info_obj_arr.length === 2) {
							first_contact_name = contact_info_obj_arr[0].firstname;
							first_contact_lastname = contact_info_obj_arr[0].lastname;
							first_contact_fullname = contact_info_obj_arr[0].firstname + " " + contact_info_obj_arr[0].middleinitial + " " + contact_info_obj_arr[0].lastname
							second_contact_name = contact_info_obj_arr[1].firstname;
							second_contact_lastname = contact_info_obj_arr[1].lastname;
							second_contact_fullname = contact_info_obj_arr[1].firstname + " " + contact_info_obj_arr[1].middleinitial + " " + contact_info_obj_arr[1].lastname

							if (activity_description === "rd.v1.auction_started") {
								starting_line = `${first_contact_fullname} and ${second_contact_fullname} have started the auction ${auction_name}`;
							} else if (activity_description === "rd.v1.auction_ended") {
								starting_line = `${first_contact_fullname} and ${second_contact_fullname} have completed the auction ${auction_name} with final price ${product_price}`;
							}
							else {
								starting_line =`Auction - ${auction_name} has been suspended`
							}
							temp_Data_obj["mapContact"].push({ contactName: first_contact_fullname, contactId: contact_info_obj_arr[0].uid });
							temp_Data_obj["mapContact"].push({ contactName: second_contact_fullname, contactId: contact_info_obj_arr[1].uid });

						}

						if (contact_info_obj_arr.length === 3) {
							first_contact_name = contact_info_obj_arr[0].firstname;
							first_contact_lastname = contact_info_obj_arr[0].lastname;
							first_contact_fullname = contact_info_obj_arr[0].firstname + " " + contact_info_obj_arr[0].middleinitial + " " + contact_info_obj_arr[0].lastname
							second_contact_name = contact_info_obj_arr[1].firstname;
							second_contact_lastname = contact_info_obj_arr[1].lastname;
							second_contact_fullname = contact_info_obj_arr[1].firstname + " " + contact_info_obj_arr[1].middleinitial + " " + contact_info_obj_arr[1].lastname
							third_contact_name = contact_info_obj_arr[2].firstname;
							third_contact_lastname = contact_info_obj_arr[2].lastname;
							third_contact_fullname = contact_info_obj_arr[2].firstname + " " + contact_info_obj_arr[2].middleinitial + " " + contact_info_obj_arr[2].lastname

							if (activity_description === "rd.v1.auction_started") {
								starting_line = `${first_contact_fullname}, ${second_contact_fullname} and ${third_contact_fullname} have started the auction ${auction_name}`;
							} else if (activity_description === "rd.v1.auction_ended") {
								starting_line = `${first_contact_fullname}, ${second_contact_fullname} and ${third_contact_fullname} have finished the auction ${auction_name} with final price ${product_price}`;
							}
							else {
								starting_line =`Auction - ${auction_name} has been suspended`
							}
							temp_Data_obj["mapContact"].push({ contactName: first_contact_fullname, contactId: contact_info_obj_arr[0].uid });
							temp_Data_obj["mapContact"].push({ contactName: second_contact_fullname, contactId: contact_info_obj_arr[1].uid });
							temp_Data_obj["mapContact"].push({ contactName: third_contact_fullname, contactId: contact_info_obj_arr[2].uid });
						}
					} else if (total_number_of_contacts_grouped_in_this_activity > 3) {
						// for (var c = 0; c < total_number_of_contacts_grouped_in_this_activity; c++) {
						// 	let contact_info_obj = await api.getContactInfo(contacts_uid_array[c], "false", reqConfig);
						// 	contact_info_obj_arr.push(contact_info_obj);
						// }
						//now this contact info obj arr will either have details of 3 and n more contacts
						first_contact_name = contact_info_obj_arr[0].firstname;
						first_contact_lastname = contact_info_obj_arr[0].lastname;
						first_contact_fullname = contact_info_obj_arr[0].firstname + " " + contact_info_obj_arr[0].middleinitial + " " + contact_info_obj_arr[0].lastname
						second_contact_name = contact_info_obj_arr[1].firstname;
						second_contact_lastname = contact_info_obj_arr[1].lastname;
						second_contact_fullname = contact_info_obj_arr[1].firstname + " " + contact_info_obj_arr[1].middleinitial + " " + contact_info_obj_arr[1].lastname
						third_contact_name = contact_info_obj_arr[2].firstname;
						third_contact_lastname = contact_info_obj_arr[2].lastname;
						third_contact_fullname = contact_info_obj_arr[2].firstname + " " + contact_info_obj_arr[2].middleinitial + " " + contact_info_obj_arr[2].lastname

						if (activity_description === "rd.v1.auction_started") {
							starting_line = `${first_contact_fullname}, ${second_contact_fullname}, ${third_contact_fullname} and ${total_number_of_contacts_grouped_in_this_activity - 3} have started the auction ${auction_name}`;
						} else if (activity_description === "rd.v1.auction_ended") {
							starting_line = `${first_contact_fullname}, ${second_contact_fullname}, ${third_contact_fullname} and ${total_number_of_contacts_grouped_in_this_activity - 3} have finished the auction ${auction_name}`;
						}
						else {
                            starting_line = `Auction - ${auction_name} has been suspended`
						}
						temp_Data_obj["mapContact"].push({ contactName: first_contact_fullname, contactId: contact_info_obj_arr[0].uid });
						temp_Data_obj["mapContact"].push({ contactName: second_contact_fullname, contactId: contact_info_obj_arr[1].uid });
						temp_Data_obj["mapContact"].push({ contactName: third_contact_fullname, contactId: contact_info_obj_arr[2].uid });
					}



					// if (activity_description === "gs.v1.internal.wait.started") {
					// 	temp_Data_obj["ActivityContent"] = `Wait Element started for ${starting_line}`
					// } else if (activity_description === "gs.v1.internal.wait.completed") {
					// 	temp_Data_obj["ActivityContent"] = `Wait Element completed for ${starting_line}`
					// } else if (activity_description === "gs.v1.internal.usertask.created") {
					// 	temp_Data_obj["ActivityContent"] = (activity_supplement === "" || activity_supplement === "string")
					// 		?
					// 		`User task created for ${starting_line}`
					// 		:
					// 		`User task titled "${(activity_supplement)}" created for ${starting_line}`
					// } else if (activity_description === "gs.v1.internal.usertask.completed") {
					// 	temp_Data_obj["ActivityContent"] = (activity_supplement === "" || activity_supplement === "string")
					// 		?
					// 		`User task marked as completed for ${starting_line}`
					// 		:
					// 		`User task titled "${(activity_supplement)}" marked as completed for ${starting_line}`
					// } else if (activity_description === "gs.v1.internal.usertask.cancelled") {
					// 	temp_Data_obj["ActivityContent"] = (activity_supplement === "" || activity_supplement === "string")
					// 		?
					// 		`User task marked as cancelled for ${starting_line}`
					// 		:
					// 		`User task titled "${(activity_supplement)}" marked as cancelled for ${starting_line}`
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.processed") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Email has been processed by Sendgrid for ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.delivered") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Email has been delivered to ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.opened") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Email has been opened by ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.clicked_positive") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Invitation has been accepted by ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.clicked_negative") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Invitation has been declined by ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.bounced") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Invitation email has been bounced for ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.dropped") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Invitation email has been dropped for ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.deferred") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting RSVP Invitation email has been deferred for ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.unsubscribe") {
					// 	temp_Data_obj["ActivityContent"] = `${starting_line} unsubscribed the Meeting RSVP emails`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.spam_report") {
					// 	temp_Data_obj["ActivityContent"] = `${starting_line} spam reported the Meeting RSVP email`;
					// } else if (activity_description === "gs.v1.adapter.rsvpEmail.exception") {
					// 	temp_Data_obj["ActivityContent"] = `Exception in sending RSVP email to ${starting_line}`;
					// }
					// else if (activity_description === "gs.v1.adapter.meetingLinkEmail.delivered") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting Invite has been sent to ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.meetingLinkEmail.opened") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting Invite Email has been opened by ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.meetingLinkEmail.bounced") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting Invite email has been bounced for ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.meetingLinkEmail.dropped") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting Invite email has been dropped for ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.meetingLinkEmail.deferred") {
					// 	temp_Data_obj["ActivityContent"] = `Meeting Invite email has been deferred for ${starting_line}`;
					// } else if (activity_description === "gs.v1.adapter.meetingLinkEmail.unsubscribe") {
					// 	temp_Data_obj["ActivityContent"] = `${starting_line} unsubscribed the Meeting link emails`;
					// } else if (activity_description === "gs.v1.adapter.meetingLinkEmail.spam_report") {
					// 	temp_Data_obj["ActivityContent"] = `${starting_line} spam reported the Meeting link email`;
					// } else if (activity_description === "gs.v1.adapter.meetingLinkEmail.exception") {
					// 	temp_Data_obj["ActivityContent"] = `Exception in sending meeting link email to ${starting_line}`;
					// }
					// else if (activity_description === "gs.v1.adapter.meeting.scheduled") {
					// 	temp_Data_obj["ActivityContent"] = `${starting_line} scheduled a meeting with you`;
					// } else if (activity_description === "gs.v1.adapter.risk_analysis.red") {
					// 	temp_Data_obj["ActivityContent"] = `Tifin Risk has categorised ${starting_line} as high risk portfolio`;
					// } else if (activity_description === "gs.v1.adapter.risk_analysis.green") {
					// 	temp_Data_obj["ActivityContent"] = `Tifin Risk has categorised ${starting_line} as low risk portfolio`;
					// } else if (activity_description === "gs.v1.adapter.risk_analysis.amber") {
					// 	temp_Data_obj["ActivityContent"] = ` Risk Analysis for ${starting_line} has failed. Retrying with Tifin Risk`;
					// } else if (activity_description === "gs.v1.adapter.risk_analysis.exception") {
					// 	temp_Data_obj["ActivityContent"] = `Error with Tifin Risk for ${starting_line}. Please contact system administrator`;
					// } else if (activity_description === "gs.v1.internal.tag.tag_added") {
					// 	temp_Data_obj["ActivityContent"] = `Tag "tag name" added for ${starting_line}`;
					// } else if (activity_description === "gs.v1.internal.tag.tag_already_present") {
					// 	temp_Data_obj["ActivityContent"] = `Contacts remain untagged since the tag "tag name" is already present for ${starting_line}.`;
					// } else if (activity_description === "gs.v1.internal.untag.tag_removed") {
					// 	temp_Data_obj["ActivityContent"] = `Tag "tag name" removed for ${starting_line}.`;
					// } else if (activity_description === "gs.v1.internal.untag.tag_not_present") {
					// 	temp_Data_obj["ActivityContent"] = `The tag "tag name" you have chosen to untag for ${starting_line} does not exist for those contacts.`;
					// } else if (activity_description === "gs.v1.internal.campaign.assign_by_tag") {
					// 	temp_Data_obj["ActivityContent"] = `${starting_line}`;
					// } else if (activity_description === "gs.v1.internal.campaign.completed") {
					// 	temp_Data_obj["ActivityContent"] = `${starting_line}`;
					// }

					if (total_number_of_contacts_grouped_in_this_activity === 1) {
						temp_Data_obj["ActivityAvatar"] =
							[
								{
									'name': `${contact_full_name}`,
									'shortform': `${contact_first_name.slice(0, 1).toUpperCase() + contact_last_name.slice(0, 1).toUpperCase()} `,
									'isName': "true"
								}
							];
					} else if (total_number_of_contacts_grouped_in_this_activity > 1 && total_number_of_contacts_grouped_in_this_activity <= 3) {

						if (total_number_of_contacts_grouped_in_this_activity === 2) {
							temp_Data_obj["ActivityAvatar"] =
								[
									{
										'name': `${first_contact_fullname}`,
										'shortform': `${first_contact_name.slice(0, 1).toUpperCase() + first_contact_lastname.slice(0, 1).toUpperCase()}`,
										'isName': "true"
									},
									{
										'name': `${second_contact_fullname}`,
										'shortform': `${second_contact_name.slice(0, 1).toUpperCase() + second_contact_lastname.slice(0, 1).toUpperCase()}`,
										'isName': "true"
									}
								];
						}
						if (total_number_of_contacts_grouped_in_this_activity === 3) {
							temp_Data_obj["ActivityAvatar"] =
								[
									{
										'name': `${first_contact_fullname}`,
										'shortform': `${first_contact_name.slice(0, 1).toUpperCase() + first_contact_lastname.slice(0, 1).toUpperCase()}`,
										'isName': "true"
									},
									{
										'name': `${second_contact_fullname}`,
										'shortform': `${second_contact_name.slice(0, 1).toUpperCase() + second_contact_lastname.slice(0, 1).toUpperCase()}`,
										'isName': "true"
									},
									{
										'name': `${third_contact_fullname}`,
										'shortform': `${third_contact_name.slice(0, 1).toUpperCase() + third_contact_lastname.slice(0, 1).toUpperCase()}`,
										'isName': "true"
									},
								];
						}

					}
					else if (total_number_of_contacts_grouped_in_this_activity > 3) {
						let string_of_names = "";
						for (var c = 3; c < contacts_uid_array.length; c++) {   //index of 3 will have the 4th contact details
							let name_of_contact_obj = await api.getContactInfo(contacts_uid_array[c], "false", reqConfig);
							string_of_names += name_of_contact_obj.firstname + " " + name_of_contact_obj.middleinitial + " " + name_of_contact_obj.lastname + ", "
						}
						temp_Data_obj["ActivityAvatar"] =
							[
								{
									'name': `${first_contact_fullname}`,
									'shortform': `${first_contact_name.slice(0, 1).toUpperCase() + first_contact_lastname.slice(0, 1).toUpperCase()}`,
									'isName': "true"
								},
								{
									'name': `${second_contact_fullname}`,
									'shortform': `${second_contact_name.slice(0, 1).toUpperCase() + second_contact_lastname.slice(0, 1).toUpperCase()}`,
									'isName': "true"
								},
								{
									'name': `${third_contact_fullname}`,
									'shortform': `${third_contact_name.slice(0, 1).toUpperCase() + third_contact_lastname.slice(0, 1).toUpperCase()}`,
									'isName': "true"
								},
								{
									'name': `${string_of_names}`,
									'shortform': `+${total_number_of_contacts_grouped_in_this_activity - 3} more`, //subract 1 as first contact is already being displayed
									'isName': "false"
								},
							];
					}

					temp_Data.push(temp_Data_obj);
				}
				temp_obj["Data"] = temp_Data;
				activity_data.push(temp_obj);
			}

			console.log("THE MAIN ACTIVITY DATA IS", activity_data);

			// setUserActivityData(activity_data);
			// setLoading(false);

			let tempArr = [];

			for (var z = 0; z < activity_data.length; z++) {

				for (var x = 0; x < activity_data[z].Data.length; x++) {
					let tempObj = {};
					tempObj["id"] = activity_data[z].Data[x].id;
					tempObj["ActivityContent"] = activity_data[z].Data[x].ActivityContent;
					tempObj["ActivityTime"] = activity_data[z].Data[x].ActivityTime;
					tempObj["ActivityAvatar"] = activity_data[z].Data[x].ActivityAvatar;
					tempObj["mapContact"] = activity_data[z].Data[x].mapContact;
					tempArr.push(tempObj);
				}
			}

			console.log("THIS IS WHAT WE WANT", tempArr);
			setUserActivityData(tempArr);
			setLoading(false);
		} else {
			console.log("no activities recorded");
			count++;
			setNoActivityHistoryFound(true);
			// setActivityHistoryDataPresent(false);
			if (dictionary.length > 0) {
				if (j == dictionary[i].Data.length - 1) setLoading(false);
			} else setLoading(false);
		}


		if (count > 0) {
			setShowAlert(true);
		}
	}


	const handleAction = (value) => {
		setTrigger(value);
		//console.log("handleaction clicked", value);
	};


	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));

	let today = new Date();
	let curHr = today.getHours();
	let current_time = '';
	if (curHr < 12) {
		current_time = 'Morning, ';
	} else if (curHr < 18) {
		current_time = 'Afternoon, ';
	} else {
		current_time = 'Evening, ';
	}
	const ariaLabel = { 'aria-label': 'description' };

	// if (loading) {
	// 	return <PageLoader />
	// }

	const Highlighted = ({ text = '', highlight = '' }) => {
		if (!highlight.trim()) {
			return <span>{text}</span>
		}
		const regex = new RegExp(`(${_.escapeRegExp(highlight)})`, 'gi')
		const parts = text.split(regex)
		return (
			<span>
				{parts.filter(part => part).map((part, i) => (
					regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
				))}
			</span>
		)
	}


	return (
		<Layout>
			{showAlert && <div className={styles.alert}>
				<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
					<InfoOutlined style={{ marginRight: '10px' }} fontSize='medium' color='inherit' />
					<p className={styles.alertText}>
						Loading Message
					</p>
				</div>
				<IconButton onClick={() => setShowAlert(false)}>
					<Close color='inherit' />
				</IconButton>
			</div>}
			<div>
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 5, overflow: 'auto' }}
					open={Trigger}
				>
					<div className={Trigger ? styles.actionBar : styles.clsBar}>
						<div className={styles.abHeader}>
							<Typography
								sx={{ display: 'inline' }}
								component="span"
								variant="body2"
								color="text.primary"

							>
								<h2 className={styles.abHeaderText}>Pending Actions</h2>
							</Typography>
							<Typography
								sx={{ display: 'inline' }}
								component="span"
								variant="body2"
								color="text.primary"
							>
								<span onClick={() => handleAction(false)} ><i> <CloseIcon fontSize="large" /></i></span>
							</Typography>
						</div>
						{/* <br></br> */}

						{pendingActionsData.map((val, key) => {
							return (
								<PendingActions
									key={key}
									title={val.title}
									uid={val.uid}
									icon={val.icon}
									description={val.description}
									text={val.text}
									name={val.name}
									campaign_name={val.campaign_name}
									campaign_uid={val.campaign_uid}
									campaign_instance_uid={val.campaign_instance_uid}
									contact_id={val.contact_id}
									timestamp={val.time}
									reqConfig={reqConfig}
								/>
							)
						})}

					</div>
				</Backdrop>
				<ContentContainer heading='Home'>
					{/* Welcome Section */}
					<Container >
						<div className={styles.FirstContentContainer}>
							<div className={styles.WelcomeBlockStyles}>
								<Box
									component='form'
									sx={{
										'& > :not(style)': { m: 1 },
									}}
									noValidate
									autoComplete='off'
								>
									<Input placeholder='Seach Contacts' inputProps={ariaLabel} />
								</Box>

								<div className={styles.actionButtons}>


									&nbsp;

									<button className={Trigger ? styles.backdrop : styles.PendingActionButtonStyles} onClick={() => handleAction(true)} >
										<span className={styles.PendingActionButtonSpan1}>{pendingActionsCount}</span>  Pending Actons    &#62;
									</button>

								</div>

							</div>
							<h1 className={styles.welcomtextstyle}>
								{current_time} {(user).charAt(0).toUpperCase() + (user).slice(1)}
							</h1>
						</div>
					</Container>

					{/* User Activity Feed */}
					<Container>
						<Grid>
							<div className={styles.userActivityStyles}>
								<h4>Latest Auction Activity</h4>
								<div
								>
									<Link href="/dashboard/allActivityPage">
										<span className={styles.seeAllActivityButton} >
											See all activity
										</span>
									</Link>
								</div>
							</div>

							{/* Latest activity */}
							<Grid item xs={4} className={styles.latestActivityStyles}>
								<div className={styles.card} style={{ "marginLeft": '1em', 'height': '335px' }}>
									{/* <img src={this.props.img} /> */}
									<div className='card-body' style={{ 'lineHeight': '8em' }}>
										<h2 style={{ display: "flex", "fontSize": "40px", "marginTop": "0px", "marginBottom": "-20px", 'lineHeight': '102px' }}>
											<strong>
												{totalActionsData.title_1}
											</strong>&nbsp;&nbsp;
											{
												Number((totalActionsData.title_2).replace('%', '') > 0)		//this needs to be fixed at a later stage to show negative numbers

													?
													<div className={styles.positivestyles} style={{ position: "relative", top: "35px", left: "-10px" }}><ArrowForwardIcon className={styles.positivevector} /><var className={styles.positiveindicatorstyle}>{totalActionsData.title_2}</var></div>
													:
													<div className={styles.negativestyles} style={{ position: "relative", top: "35px", left: "-10px" }}><ArrowForwardIcon className={styles.negativevector} /><var className={styles.negativeindicatorstyle}>{totalActionsData.title_2}</var></div>

											}
										</h2>
										<h5 style={{
											fontFamily: 'sans-serif',
											color: '#50555C',
											fontStyle: 'normal',
											fontWeight: '600',
											fontSize: '16px',
											lineHeight: '150%',
											marginBottom: '-3px',
											marginTop: '22px',

										}}>
											Total bids performed in RadBid since last week.</h5>
										<p>{totalActionsData.content}</p>
									</div>
								</div>


							</Grid>

							{/* See all activity */}
							{
								noActivityHistoryFound
									?
									<div className={styles.noActivityFoundCard} >
										<h3 className={styles.noActivityFoundText}>No Activity History Records found</h3>
									</div>
									:
									<Grid item xs={8} className={styles.seeAllActivityStyles}>
										{
											<UserActiviityList UserActivityData={UserActivityData} />
										}

									</Grid>
							}



						</Grid>



					</Container>
					<br></br>
					<br></br>



					{/* Browse Integrations */}

					<Container>

						<Card
							style={{
								height: 160,
								background: 'linear-gradient(89.31deg, #D0D3FF 0%, #52579C 100%)',
								padding: 25,
								borderRadius: 15,
								width: '103%',
							}}
						>
							{/* <div className={styles.ellipse1_1} />
							<div className={styles.ellipse1_2} /> */}
							<div style={{ display: 'flex', flexWrap: 'wrap', zIndex: 9, position: 'absolute' }}>
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
									<Card sx={{ width: 245, height: 110 }} style={{ borderRadius: 15 }}>
										<CardContent style={{ paddingBottom: '2%' }}>
											<Box
												style={{
													width: 56,
													height: 56,
													background: '#F7F8FA',
													borderRadius: 15,
												}}
											>
												<img src='/Sendgrid.png' style={{ position: 'absolute', width: '50px', height: '50px' }} />
												{/* <Typography variant='h5' style={{ width: 24, height: 24, padding: 16 }}>
													as
												</Typography> */}
											</Box>
											<Typography
												variant='h5'
												sx={{
													fontSize: 14,
													fontWeight: 700,
													color: '#50555C',
												}}
											>
												SendGrid
											</Typography>
										</CardContent>
									</Card>
									<Card sx={{ width: 271, height: 110 }} style={{ borderRadius: 15 }}>
										<CardContent style={{ padding: '6%' }}>
											<Box
												style={{
													width: 56,
													height: 56,
													background: '#F7F8FA',
													borderRadius: 20,
												}}
											>
												<img src='/Tifin risk.png' style={{ width: 54 }} />
											</Box>
											<Typography
												variant='h5'
												sx={{
													fontFamily: 'Open Sans',
													fontSize: 14,
													fontWeight: 700,
													color: '#50555C',
												}}
											>
												Tifin Risk
											</Typography>
										</CardContent>
									</Card>
								</div>
								<CardContent style={{ marginLeft: 10 }}>
									<Box sx={{ width: 480, height: 75 }}>
										<Typography
											variant='h5'
											component='div'
											sx={{
												position: 'relative',
												right: '-94px',
												fontSize: 18,
												fontWeight: 700,
												color: '#fff',
												textAlign: 'right',
											}}
										>
											Did you know 63% of your compensation <br /> comes from 35% of your clients?
										</Typography>
									</Box>
									<Box sx={{ width: 480, height: 30 }}>
										<Link href='/integrations'>
											<Button
												style={{ position: 'relative', right: '-313px', backgroundColor: 'transparent' }}
											>
												<Typography
													className={styles.integrationsButton}
													variant='h5'
													component='div'
												>
													Browse Integrations
												</Typography>
												<div className={styles.gg_arrow_long_right}>
												</div>
											</Button>
										</Link>
									</Box>
								</CardContent>
							</div>
						</Card>

					</Container>
					<br></br>
					<br></br>

					{/* Latest Workflows */}





					<Container>
						<div className={styles.LatestWorkflowsHeaderStyles}>
							<h4>Latest Workflows</h4>
							<Link href="/automations">
								<span className={styles.seeWorkflowsButton} >
									See Workflows
								</span>
							</Link>
						</div>


						<BrowseTemplates />
					</Container>
					<br></br>
					<br></br>

					{/* Contacts */}
					<Container>
						<h4 style={{ position: 'relative' }}>Contacts</h4>
						<div className={styles.ContactsSectionStyles}>
							<ReactCard SampleData={ContactsData} />

							{
								(engagementDataAvailable)

									?
									<ol>
										{' '}
										<h5>Engagement Breakdown</h5>

										{engagement_breakdown.map((key, val) => {
											return (
												<div>
													<li key={val}>
														<b>{key.Value}&nbsp;&nbsp;</b>
														{key.Name}
													</li>{' '}

													<br></br>
												</div>
											);
										})}
										<span className={styles.dot1}></span>
										<span className={styles.dot2}></span>
										<span className={styles.dot3}></span>
									</ol>
									:
									<Card className={styles.engagementCard} sx={{
										minWidth: '20%', marginBottom: '2%', boxShadow: 'none', width: '0px', position: 'relative', bottom: '-13px', right: '-14px'
										//  position: 'relative', right: '-850px', top: '-210px' 
									}}>
										<React.Fragment >
											<div className='card-body'>
												<CardContent>
													<Typography variant='h5' component='div' sx={{ fontWeight: 600, display: "flex" }}>
														No Engagement Data Records Available
													</Typography>
													<br></br>
													<Typography sx={{ mb: 1.5 }} color='text.secondary'>
														Upload Contacts and start engaging with them!
													</Typography>

													<Typography variant='body2'>
														<Highlighted text="View the engagement breakdown chart in this section once you engage with your contacts." highlight="engagement breakdown chart" />

													</Typography>
												</CardContent>

											</div>
										</React.Fragment>
									</Card>
							}
							&nbsp;&nbsp;&nbsp;&nbsp;

							{
								(engagementDataAvailable)
									?

									<div
										style={{ position: 'relative', right: '-35px', bottom: '-30px' }}>
										<PieChart
											labels={['Highly engaged', 'Moderately engaged', 'Idle']}
											data={engagementDataSet}
											height={200}
											width={150}
										/>
									</div>
									:
									<span></span>
							}



						</div>
					</Container>
					<br></br>
					<br></br>

					{/* Create Segment */}
					<Container>
						<Card
							sx={{ maxWidth: 1100, height: 80 }}
							style={{
								position: 'relative',
								background: 'linear-gradient(89.31deg, #ECF7FF 0%, #C1E7FF 100%)',
								borderRadius: 15,
							}}
						>
							<CardContent>
								<Box
									sx={{ width: 280, height: 40 }}
									style={{ position: 'absolute', top: 20, left: 30 }}
								>
									<Typography
										variant='h5'
										component='div'
										sx={{ fontSize: 14, fontWeight: 700, color: 'rgba(0, 163,214, 1)' }}
									>
										Offer personalized experiences by segmenting your contacts by assigning tags
									</Typography>
								</Box>
								<Box
									sx={{ width: 280, height: 40 }}
									style={{ position: 'absolute', top: 40, right: 20 }}
								>
									<Link href='/myContacts'>
										<Button
											style={{ backgroundColor: 'transparent' }}>
											<Typography
												variant='h5'
												component='div'
												sx={{ fontSize: 14, fontWeight: 600, color: '#003657', position: 'relative', textTransform: 'none' }}
											>
												Create Tags
											</Typography>
											<div className={styles.gg_arrow_long_right_segments}>
											</div>
										</Button>
									</Link>

								</Box>
							</CardContent>
						</Card>
					</Container>

				</ContentContainer>
			</div>
		</Layout >

	)
}