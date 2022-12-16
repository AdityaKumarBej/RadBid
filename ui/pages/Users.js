import React, { Component, useEffect, useState } from 'react';
import Layout from '../src/Components/Layout/Layout';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';
import Link from 'next/link';
import { MdNavigateBefore } from 'react-icons/md';
import TabbedWidget from '../src/Components/Tabs/TabbedWidget';
import TabContainer from '../src/Components/Tabs/TabbedContainer';
import { ButtonBase } from '@material-ui/core';
import { UI_CONTEXT_ROOT } from '../src/GlobalConfig';


import AllUsers from '../src/BusinessComponents/Users/AllUsers';


import { BiArrowBack } from 'react-icons/bi';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styles from './Users.module.css';
import Typography from '@mui/material/Typography';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@material-ui/core';
import InfoIcon from '@mui/icons-material/Info';


export default function MyContacts(props) {
	const [headerActionsAvailable, setHeaderActionsAvailable] = useState(true);
	const [currentTabIdx, setCurrentTabIdx] = useState(0);
	const [currentPageIdx, setCurrentPageIdx] = useState(0);
	const [tabLabels, setTabLabels] = useState([
		//{ label: 'Overview', count: 0 },
		{ label: 'All Contacts', count: 0 },
		//{ label: 'Tags', count: 0 },
	])
	const [tabWidgetKey, setTabWidgetKey] = useState(Math.random());
	const [wizardKey, setWizardKey] = useState(Math.random());
	const [profile, setProfile] = useState(undefined);
	const [filterMode, setFilterMode] = useState(false);
	const [tagSelected, setTagSelected] = useState('');
	const [selectedId, setSelectedId] = useState(null);
	const [openCSV, setOpenCSV] = useState(false);
	const [contactHistoryData, setContactHistoryData] = useState([]);

	const tabbedWidgetRef = React.createRef();

	useEffect(() => {
		// let profile = JSON.parse(sessionStorage.getItem("profile"))
		// let reqConfig = {
		// 	headers: {
		// 		'x-gs-domain': profile.domain,
		// 		'x-gs-user': profile.username
		// 	}
		// }
		populateTopCardsData();
	}, []);

	const populateTopCardsData = async (reqConfig) => {
		// let contactHistoryDataObj = await api.getContactHistory("quarterly", reqConfig);

		const totalContacts = 100;
		const inWorkflowContacts = 20;
		const idleContacts = totalContacts - inWorkflowContacts;
		const neverInWorkflowContacts = totalContacts - 23;
		let tempArr = [];
		tempArr.push(totalContacts, inWorkflowContacts, idleContacts, neverInWorkflowContacts);
		console.log("CHECK THIS OUT", tempArr);

		setContactHistoryData(tempArr);
	}

	const renderImportContacts = () => {
		setCurrentPageIdx(1);
	};
	const refreshPage = () => {
		setCurrentPageIdx(0);
		setTabWidgetKey(Math.random());
		setWizardKey(Math.random());
		window.location.reload(true);
	};
	

	const revertToDashboard = () => {
		setCurrentPageIdx(0);
		setSelectedId(null);
	};


	const tagSelectedFn = (tagSelected) => {
		console.log("changing tab and tag selected is", tagSelected);
		setCurrentTabIdx(1);
		setTabWidgetKey(Math.random());
		setTagSelected(tagSelected);
		setFilterMode(true);
	}

	const removeTagSelected = (from) => {
		console.log("REMOVING TAGS FILTER", from);
		setTagSelected('');
	}

	const removeFilterMode = () => {
		console.log("setting filter to false");
		setFilterMode(false);
	}


	let headerActions = [];
	if (currentPageIdx === 0 && headerActionsAvailable) {
		headerActions.push({ label: 'Add Users +', handler: renderImportContacts });
	}
	return (
		<Layout>
			{
				currentPageIdx === 0 ? (
					<ContentContainer
						heading='Users'
						headingOn="true"
						headerActions={headerActions}
						marginTop="2%"
						headerBtnStyle={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							padding: "16px",
							gap: "6px",
							width: "142px",
							height: "45px",
							textAlign: "center",
							color: "#FFFFFF",
							fontStyle: "normal",
							fontSize: "16px",
							lineHeight: "24px",
							background: "linear-gradient(247.73deg, #00A3D6 0%, #00578E 100%)",
							borderRadius: "16px",
							marginLeft: "-14%"
						}}
					// width="1200px"
					>
						<br></br>
						<br></br>

						<AllUsers />
						{/* <TabbedWidget
							resumeIdx={currentTabIdx}
							ref={tabbedWidgetRef}
							width='auto'
							tabLabels={tabLabels}
							tabColor='primary'
							indicatorColor='secondary'
							key={tabWidgetKey}
							styledTabs={true}
						>

							<TabContainer>
								<AllUsers />
							</TabContainer>
						
						</TabbedWidget> */}
					</ContentContainer>
				) :
					(
						<ContentContainer
							width="98%"
							marginTop="2%"
							headingOn="false"
						>
							<div style={{ marginLeft: '5%' }}>

								<div className={styles.contactbutton}>
									<ButtonBase onClick={revertToDashboard}>
										<BiArrowBack /> Contacts
									</ButtonBase>
								</div>

								<div className={styles.headertext}>Import your contacts</div>
								<span className={styles.infobtn}><b><InfoIcon fontSize="large" color="primary" onClick={() => { setOpenCSV(true) }} /></b></span>
								<div className={styles.statictext1}>
									Use the upload feature in RadBid to bulk import participants into the system. The uploaded participants will have to confirm their registration
									via email. 
									
								</div>
								<div className={styles.statictext2}>How would you like to import your contacts?</div>
								<Card
									sx={{ maxWidth: 300, height: 100 }}

									className=
									{
										selectedId && selectedId == 1
											? styles.selecteduploadcard
											: styles.uploadcard
									}
									onClick={() => {
										setSelectedId(1);
									}}
								>
									<CardContent>
										<Box
											sx={{ width: 250, height: 75 }}
											style={{ position: 'absolute', top: 40, left: 30 }}
										>
											<Typography
												variant='h5'
												component='div'
												sx={{ fontSize: 16, fontWeight: 600, color: 'rgba(0, 163,214, 1)' }}
											>
												Upload using .csv, .xls or .xlsx file
											</Typography>
										</Box>
									</CardContent>
								</Card>
								<Card
									sx={{ maxWidth: 300, height: 100 }}
									className={
										selectedId && selectedId == 2
											? styles.selecteduploadcard2
											: styles.uploadcard2
									}
									onClick={() => {
										setSelectedId(2);
									}}
								>
									<CardContent>
										<Box
											sx={{ width: 250, height: 75 }}
											style={{ position: 'absolute', top: 40, left: 30 }}
										>
											<Typography
												variant='h5'
												component='div'
												sx={{ fontSize: 16, fontWeight: 600, color: 'rgba(0, 163,214, 1)' }}
											>
												Add single user
											</Typography>
										</Box>
									</CardContent>
								</Card>
								<Card
									sx={{ maxWidth: 300, height: 100 }}
									className={
										selectedId && selectedId == 3
											? styles.selecteduploadcard3
											: styles.uploadcard3
									}
									onClick={() => {
										setSelectedId(3);
									}}
								>
									<CardContent>
										<Box
											sx={{ width: 250, height: 75 }}
											style={{ position: 'absolute', top: 40, left: 30 }}
										>
											<Typography
												variant='h5'
												component='div'
												sx={{ fontSize: 16, fontWeight: 600, color: 'rgba(0, 163,214, 1)' }}
											>
												Sync data from external source
											</Typography>
										</Box>
									</CardContent>
								</Card>
								<Card
									sx={{ maxWidth: 300, height: 100 }}
									className={
										selectedId && selectedId == 4
											? styles.selecteduploadcard4
											: styles.uploadcard4
									}
									onClick={() => {
										setSelectedId(4);
									}}
								>
									<CardContent>
										<Box
											sx={{ width: 250, height: 75 }}
											style={{ position: 'absolute', top: 40, left: 30 }}
										>
											<Typography
												variant='h5'
												component='div'
												sx={{ fontSize: 16, fontWeight: 600, color: 'rgba(0, 163,214, 1)' }}
											>
												Sync data from third party
											</Typography>
										</Box>
									</CardContent>
								</Card>
								<Card
									sx={{ maxWidth: 300, height: 100 }}
									className={
										selectedId && selectedId == 5
											? styles.selecteduploadcard5
											: styles.uploadcard5
									}
									onClick={() => {
										setSelectedId(5);
									}}
								>
									<CardContent>
										<Box
											sx={{ width: 250, height: 75 }}
											style={{ position: 'absolute', top: 40, left: 30 }}
										>
											<Typography
												variant='h5'
												component='div'
												sx={{ fontSize: 16, fontWeight: 600, color: 'rgba(0, 163,214, 1)' }}
											>
												Sync data from external source
											</Typography>
										</Box>
									</CardContent>
								</Card>

								{
									(selectedId === 1)
									?
							<Link href={`/uploadFile`}>
								<ButtonBase
									style={{
										float: 'left',
										background: selectedId !== null ? 'linear-gradient(247.73deg, #00A3D6 0%, #00578E 100%)' : '#E1E5EB',
										color: selectedId !== null ? '#ffffff' : '#CED4DB',
										padding: '10px',
										marginRight: '10px',
										borderRadius: 11,
										marginTop: '-70px',
									}}
									disabled={selectedId !== null ? false : true}
								>
									Continue
								</ButtonBase>
                            </Link>
									:

									<Link href={`/addUser`}>
								<ButtonBase
									style={{
										float: 'left',
										background: selectedId !== null ? 'linear-gradient(247.73deg, #00A3D6 0%, #00578E 100%)' : '#E1E5EB',
										color: selectedId !== null ? '#ffffff' : '#CED4DB',
										padding: '10px',
										marginRight: '10px',
										borderRadius: 11,
										marginTop: '-70px',
									}}
									disabled={selectedId !== null ? false : true}
									// onClick={() => {
									// 	window.location.pathname = `${UI_CONTEXT_ROOT}/uploadFile?selectedId=${selectedId}`;
									// }}
								>
									Continue
								</ButtonBase>
                            </Link>

								}
								
								

								<div>
									<Dialog
										open={openCSV}
										style={{ minWidth: '500px', margin: "1rem" }}
										PaperProps={{ square: true }}
									>
										<div style={{ minWidth: '350px', backgroundColor: '#007bb6', padding: '20px' }}>
											<span style={{ color: '#ffffff', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
												Prerequisites for Contacts Upload
											</span>
										</div>
										<ul>
											<li>It is mandatory that contact should have the Firstname,Middlename,Lastname,Title,Suffix,Email,Dob and Gender</li>
											<li>Dob should be in YYYY-MM-DD format</li>
											<li>For Country Code (optional field) the maximum number of characters should not exceed 3 and should not have any digits or special characters</li>
											<li>For Zip Code (optional field) the maximum number of characters should not exceed 8 and and should not have any special characters</li>
										</ul>
										<DialogActions>
											<Button style={{ fontFamily: 'sans-serif', color: '#007BB6', textTransform: 'initial', borderRadius: "20px" }} variant="outlined" onClick={() => { setOpenCSV(false) }}>
												Ok
											</Button>
										</DialogActions>

									</Dialog>
								</div>
							</div>
						</ContentContainer>

					)

			}

		</Layout>

	);

}