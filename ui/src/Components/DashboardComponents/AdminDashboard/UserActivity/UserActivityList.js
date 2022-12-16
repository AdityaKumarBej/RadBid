import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import { styled } from '@mui/material/styles';
import styles from './LatestActivity.module.css';
import Tooltip from "@material-ui/core/Tooltip";
import reactStringReplace from 'react-string-replace';
import Link from 'next/link';
import userStyles from './UserActivityList.module.css';
// Grouped Avatar - Groups Avatar when more than 2 are to be displayed
const SmallAvatar = styled(Avatar)(({ theme }) => ({
	width: 22,
	height: 22,
	border: `2px solid ${theme.palette.background.paper}`,
}));

export const GroupedAvatar = (props) => {
	if (props.AvatarList.length > 1) {
		let newlist = props.AvatarList.slice(1, props.AvatarList.length)
		// console.log(props.AvatarList)
		// console.log("New List of Avatars : ", newlist);
		return (
			<div>
				<AvatarGroup max={2}>
					{props.AvatarList.map((eachAvatar, i) => (
						<Avatar src={eachAvatar} alt='' key={i} />
					))}
				</AvatarGroup>
			</div>
		);
	} else {
		return (
			<div>
				<AvatarGroup max={2}>
					{props.AvatarList.map((eachAvatar, i) => (
						<Avatar src={eachAvatar} alt='' key={i} />
					))}
				</AvatarGroup>
			</div>
		);
	}
};

// Renders Each Card In User Activity in Dashboard
function stringToColor(name) {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < name.length; i += 1) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = '#';

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	/* eslint-enable no-bitwise */
	return color;
}

const highlightName = (mapContact, text) => {
	let newString;
	let length = mapContact.length;
	let campagin_profile_link = `/automations/workflowReport?uid=${mapContact[0].campaign_instance_id}&campaign=${mapContact[0].campaign_id}&selectedTab=performance`;
	if (length === 2) {
		newString = reactStringReplace(text, mapContact[0].campaign_name, (match, i) => (
			<Link href={campagin_profile_link}><span className={userStyles.names}>{match}</span></Link>
		));
		let contact_profile_link_1 = `/myContacts/contactProfile?uid=${mapContact[1].contactId}`
		newString = reactStringReplace(newString, mapContact[1].contactName, (match, i) => (
			<Link href={contact_profile_link_1}><span className={userStyles.names}>{match}</span></Link>
		));

	} else if (length === 3) {
		newString = reactStringReplace(text, mapContact[0].campaign_name, (match, i) => (
			<Link href={campagin_profile_link}><span className={userStyles.names}>{match}</span></Link>
		));
		let contact_profile_link_2 = `/myContacts/contactProfile?uid=${mapContact[1].contactId}`
		newString = reactStringReplace(newString, mapContact[1].contactName, (match, i) => (
			<Link href={contact_profile_link_2}><span className={userStyles.names}>{match}</span></Link>
		));
		let contact_profile_link_3 = `/myContacts/contactProfile?uid=${mapContact[2].contactId}`
		newString = reactStringReplace(newString, mapContact[2].contactName, (match, i) => (
			<Link href={contact_profile_link_3}><span className={userStyles.names}>{match}</span></Link>
		));
	} else if (length === 4) {
		newString = reactStringReplace(text, mapContact[0].campaign_name, (match, i) => (
			<Link href={campagin_profile_link}><span className={userStyles.names}>{match}</span></Link>
		));
		let contact_profile_link_4 = `/myContacts/contactProfile?uid=${mapContact[1].contactId}`
		newString = reactStringReplace(newString, mapContact[1].contactName, (match, i) => (
			<Link href={contact_profile_link_4}><span className={userStyles.names}>{match}</span></Link>
		));
		let contact_profile_link_5 = `/myContacts/contactProfile?uid=${mapContact[2].contactId}`
		newString = reactStringReplace(newString, mapContact[2].contactName, (match, i) => (
			<Link href={contact_profile_link_5}><span className={userStyles.names}>{match}</span></Link>
		));

		let contact_profile_link_6 = `/myContacts/contactProfile?uid=${mapContact[3].contactId}`
		newString = reactStringReplace(newString, mapContact[3].contactName, (match, i) => (
			<Link href={contact_profile_link_6}><span className={userStyles.names}>{match}</span></Link>
		));

	}

	return (newString);
}

export const Card = (props) => (
	<div>
		<List sx={{ bgcolor: '#fff' }}>
			<ListItem alignItems='flex-start'>

				{
					props.ActivityAvatar.map((val, key) => {
						return (
							<Tooltip title={val.name}>
								{
									(val.isName === "true")
										?
										<Avatar sx={{ bgcolor: stringToColor(val.name) }}>{val.shortform}</Avatar>
										:
										<Avatar sx={{ textAlign: 'center', fontSize: '13px', position: 'relative', right: '-5px' }}>{val.shortform}</Avatar>
								}

							</Tooltip>
						)

					})
				}

				<ListItemText
					//   primary="Brunch this weekend?"
					secondary={
						<React.Fragment>
							<Typography
								sx={{ display: 'inline' }}
								component='span'
								variant='body2'
								color='text.primary'
							></Typography>
							<div className={styles.UserActivityCardStyle}>
								{/* <div className={styles.ContentStyle}>{props.ActivityContent}</div> */}
								<div className={styles.ContentStyle}>{highlightName(props.mapContact, props.ActivityContent)}</div>
								<div className={styles.ContentTimeStyle}>{props.ActivityTime}&nbsp;&nbsp; <span styles={{ color: "#50555C" }}>&#62;</span></div>
							</div>
						</React.Fragment>
					}
				/>
			</ListItem>
			<Divider />
		</List>
	</div>
);

// Renders Data In User Activity in Dashboard dynamically
export const UserActiviityList = (props) => (
	<div>
		{props.UserActivityData.map((card, i) => (
			<Card
				ActivityContent={card.ActivityContent}
				ActivityTime={card.ActivityTime}
				ActivityAvatar={card.ActivityAvatar}
				// contactName={card.contactName}
				// contactId={card.contactId}
				mapContact={card.mapContact}
				id={card.id}
				key={i}
			/>
		))}
	</div>
);