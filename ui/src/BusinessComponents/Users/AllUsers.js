import React, { useState, useEffect } from 'react';
import UsersStatsCards from '../../../src/Components/Cards/UsersCards/UsersStatsCard';
import { ButtonBase } from '@material-ui/core';
import Button from '@mui/material/Button';
import { UI_CONTEXT_ROOT } from '../../../src/GlobalConfig';
import Chip from '@mui/material/Chip';
import ViewContactTagsPopup from './ViewContactTagsPopup';
import AssignTagToContactsPopup from './AssignTagToContactsPopup';
// const api = require('../../../../api/campaignManager');
// const axios = require('axios').default;
import styles from './AllUsers.module.css'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Stack from '@mui/material/Stack';
import { CustomDataGrid } from '../../Components/Datagrid/DataGrid';
import { IconButton } from '@mui/material';
import { Replay } from '@mui/icons-material';


function AllUsers(props) {
	const [dataGridRows, setDataGridRows] = useState([]);
	const [selectedContacts, setSelectedContacts] = useState([]);
	const [totalContacts, setTotalContacts] = useState(0);
	const [totalContactsInWorkflow, setTotalContactsInWorkflow] = useState(0);
	const [totalContactsIdle, setTotalContactsIdle] = useState(0);
	const [totalContactsNeverInWorkflow, setTotalContactsNeverInWorkflow] = useState(0);

	const [reqConfig, setReqConfig] = useState({});
	const [tagContactsDialog, setTagContactsDialog] = useState(false)
	const [tagPopupDialogOpen, setTagPopupDialogOpen] = useState(false)
	const [lastBidPrice, setLastBidPrice] = useState("");
	const [dialogMessage, setDialogMessage] = useState('Choose Tag')
	const [selectedContactUids, setSelectedContactUids] = useState([])
	const [allTagpopup, setAllTagpopup] = useState(false);
	const [filterModeAC, setFilterModeAC] = useState(false);
	const [updatetable, setUpdatetable] = useState(false);

	const [TagContactsbtn, setTagContactsbtn] = useState(true);

	useEffect(() => {
	


		// let profile = JSON.parse(sessionStorage.getItem("profile"));


		// let reqConfig = {
		// 	headers: {
		// 		'x-gs-domain': profile.domain,
		// 		'x-gs-user': profile.username
		// 	}
		// }

		let contacts = [
			{
				uid: 1,
				firstname: 'Alex',
				middleinitial: 'Marshall',
				lastname: 'Mathers',
				title: 'Mr',
				suffix: 'Ms',
				email: 'alex@gmail.com',
				phone: '50242023223',
				dob: '12/12/2022',
				gender: 'Male',
				tag: ["General"],
				inAuction: true
			},
			{
				uid: 2,
				firstname: 'Jake',
				middleinitial: 'Jk',
				lastname: 'Radox',
				title: 'Mr',
				suffix: 'Ms',
				email: 'jake@gmail.com',
				phone: '50242023223',
				dob: '12/12/2022',
				gender: 'Male',
				tag: ["General"],
				inAuction: false
			}
		]

		setReqConfig();
		generateTableData(contacts);
		generateContactHistory();

	}, [updatetable]);


	const generateContactHistory = async (reqConfig) => {
		const totalContacts = 10;
		const inWorkflowContacts = 9;
		const idleContacts = totalContacts - inWorkflowContacts;
		const neverInWorkflowContacts = totalContacts - 1;
		setTotalContacts(totalContacts);
		setTotalContactsInWorkflow(inWorkflowContacts);
		setTotalContactsIdle(idleContacts);
		setTotalContactsNeverInWorkflow(neverInWorkflowContacts);
	}


	const generateTableData = async (contacts) => {
		console.log("generating data in table");
		for (var i =(contacts).length - 1; i >= 0; i--) {
			setTotalContacts(contacts.length);
		
			let tempContactObj = {
				id: contacts[i].uid,
				firstName: contacts[i].firstname,
				middleName: contacts[i].middleinitial,
				lastName: contacts[i].lastname,
				title: contacts[i].title,
				suffix: contacts[i].suffix,
				email: contacts[i].email,
				phone: contacts[i].phone,
				dob: contacts[i].dob,
				gender: (contacts[i].gender).charAt(0).toUpperCase() + (contacts[i].gender).slice(1),
				tag: contacts[i].tag
			};
			tempContactObj["status"] = (contacts[i].inAuction === true ? "In Auction" : "Idle");
			setDataGridRows((dataGridRows) => [...dataGridRows, tempContactObj]);
		}
	}

	
	const columns = [
		{
			label: 'ID', name: 'id', options: {
				display: false,
			}
		},
		{
			label: 'First Name', name: 'firstName', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>FIRST NAME</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Middle Name', name: 'middleName', width: 100,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>MIDDLE NAME</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Last Name', name: 'lastName', width: 120,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>LAST NAME</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Title', name: 'title', width: 140,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>TITLE</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Suffix', name: 'suffix', width: 120,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>SUFFIX</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Email', name: 'email', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>EMAIL</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Phone', name: 'phone', width: 120,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>PHONE</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Date of Birth', name: 'dob', width: 120,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>BIRTHDAY</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Gender', name: 'gender', width: 120,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>GENDER</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Tags', name: "tag", width: 500,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>TAGS</p>
				),
				customBodyRender: (value, tableMeta, updateValue) => {
					if (value.length > 2) {
						return (
							<>
								<Stack direction="row" spacing={0.5}>
									{value.slice(-2).map((tag, key) => {
										// console.log("value", value);
										return (
											// <div key={key}style={{margin:4,border:'solid',borderRadius:10,color: '#00578E'}}>{tag}</div>

											<Chip
												size="medium"
												key={key}
												label={tag}
												onClick={handleClick}
												style={{ margin: 4, borderRadius: 20, color: '#00578E' }}
											/>

										)

									})}
									<b>	<Chip label={value.length - 2 + ' more..'} color="info" size="medium" variant="outlined" onClick={() => {
										handleClickmore(tableMeta.rowData[0]);
									}}
										style={{ margin: 4, border: 'ridge', borderRadius: 20, color: '#00578E' }} /></b>
								</Stack>
							</>
						)

					} else {
						return value.map((tag, key) => {
							// console.log("value", value);
							return (
								// <div key={key}style={{margin:4,border:'solid',borderRadius:10,color: '#00578E'}}>{tag}</div>
								<Chip
									size="medium"
									key={key}
									label={tag}
									onClick={handleClick}
									style={{ margin: 4, borderRadius: 20, color: '#00578E' }}
								/>
							)
						})
					}
				},
				//only apply filter when filterMode is set to true
				//filterList: setTagApplied()		condition to check if tag selected is empty or not

				// filterList: (props.tagSelected === '') ? [] : [props.tagSelected]
			}
		},
		{
			label: 'Status', name: "status", width: 500,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>STATUS</p>
				),
				customBodyRender: (value) => {

					console.log("checking value", value);
					if (value === "In Workflow") {
						return (
							<div className={styles.InWorkflowStatusBox}>
								<p className={styles.InWorkflowStatusText}>{value}</p>
							</div>
						)
					}
					else if (value === "Idle") {
						return (
							<div className={styles.IdleWorkflowStatusBox}>
								<p className={styles.IdleWorkflowStatusText}>{value}</p>
							</div>
						)
					}

				},
			}
		},
		{
			label: 'Actions', name: '', width: 400,
			options: {
				sort: false,

				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>ACTIONS</p>
				),

				customBodyRender: (value, tableMeta, updateValue) => (
					<strong>
						<Button
							variant="contained"
							color="primary"
							size="medium"
							style={{ marginLeft: 16, borderRadius: 5, textTransform: "none", whiteSpace: "nowrap" }}
							onClick={() => {
								navigateToContactProfile(tableMeta.rowData[8]);

								console.log("check last bid price", tableMeta.rowData[8]);
								console.log("initial bid price", tableMeta.rowData[7]);
							}}
						>
							View Profile
						</Button>
					</strong>
				)
			}
		},

	]

	const handleClick = () => {
		console.info('You clicked the Chip');
	};

	const handleClickmore = (contactUid) => {
		return (window.location = `${UI_CONTEXT_ROOT}/users/contactProfile?uid=${contactUid}`);
	}

	const handleDelete = () => {
		console.info('You clicked the delete icon');
	};


	const navigateToContactProfile = (contactUid) => {
		return (window.location = `${UI_CONTEXT_ROOT}/users/contactProfile?uid=${contactUid}`);
	}

	const refreshTable = () => {
		setDataGridRows([])
		generateTableData(reqConfig)
	}

	const options = {
		filterType: 'checkbox',
		rowsPerPage: 10,
		rowsPerPageOptions: [10, 15, 25, 50, 100],
		jumpToPage: true,
		selectableRows: 'multiple',
		textLabels: {
			pagination: {
				next: "Next >",
				previous: "< Previous",
				rowsPerPage: "Total items Per Page",
				displayRows: "OF"
			},
			body: {
				noMatch: 'Waiting for records to be fetched....',
			}
		},
		setFilterChipProps: (colIndex, colName, data) => {
			console.log("a filter has been applied");

			// props.refreshTagSelected("from all contacts");



		},



		customToolbarSelect: () => { },


		onChangePage(currentPage) {
			console.log({ currentPage });
		},
		onChangeRowsPerPage(numberOfRows) {
			console.log({ numberOfRows });
		},

		onRowClick(rowData, rowMeta) {
			//console.log({ rowData, rowMeta })
			console.log("the row data uid is", rowData[0])
		},



		onRowSelectionChange(currentRowsSelected, allRowsSelected, rowsSelected) {
			console.log(currentRowsSelected, allRowsSelected, rowsSelected)
			//need the tableMetaData here
			const result = allRowsSelected.map(item => {
				//the item should be the tableMeta data uid
				return dataGridRows.at(item.dataIndex)		//un-comment this when using api data

				//return ContactsStubData.at(item.dataIndex)
			});
			console.log("checking result", result);
			const selectedIds = result.map(item => { return item.id })
			// console.log("typeofselectedids", typeof (selectedIds))
			console.log("checking selectedIds", selectedIds)

			if (selectedIds.length > 0) {
				setTagContactsbtn(false)
			}
			else {
				// toast.error("No Contact selected for Tagging!!!")
				setTagContactsbtn(true)

			}

			setSelectedContactUids(selectedIds)
		},
		customToolbar: () => {
			return (
				<IconButton onClick={() => refreshTable()}>
					<Replay />
				</IconButton>
			)
		}
	}



	const handleDialogClose = (tag_name) => {
		setTagContactsDialog(false);
		console.log('the tag is', tag_name);
		console.log("the contacts selected are", selectedContactUids)

		// try {
		// 	axios.post(`${CAMPAIGN_API_URL}/contacts/tag/${tag_name}`, selectedContactUids, reqConfig)
		// 		.then(
		// 			(response) => {
		// 				console.log("checking response", response)


		// 				if (response.status === 202) {
		// 					toast.success("Tag Added")
		// 					console.log("contacts tagged successfully");
		// 					setUpdatetable(!updatetable);
		// 					setDataGridRows([]);

		// 				}
		// 				else {
		// 					console.log("contacts not tagged successfully");
		// 					toast.error("Failed to create Tag")
		// 				}
		// 			},
		// 			(error) => {
		// 				console.log("create tag api error", error)
		// 			}
		// 		)

		// } catch (error) {
		// 	throw error;
		// }

		// window.location.reload(true);
	}

	const assignTagToContacts = (tag_name) => {
		console.log("TagContactsbtn -->", TagContactsbtn)
		if (TagContactsbtn) {
			// toast.error("No Contact selected for Tagging!!!")
		}
		else {
			setTagContactsDialog(true)
		}


	}

	return (
		<div>
			<br></br>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<UsersStatsCards style={{
					justifyContent: 'left',
					display: 'flex',
					width: '100%',
					marginLeft: '5%'
				}}
					totalContacts={totalContacts}
					totalContactsInWorkflow={totalContactsInWorkflow}
					totalContactsIdle={totalContactsIdle}
					totalContactsNeverInWorkflow={totalContactsNeverInWorkflow}

				/>
			</div>
			<br></br>
			<br></br>
			<br></br>


			<table width="100%" cellPadding="10px">
				<tbody>
					<tr>
						<div style={{ marginLeft: '30%' }}>


							<Button
								className={styles.btnStyle}
								style={{
									borderRadius: "16px",
									display: "flex",
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									padding: " 8px",
									gap: "6px",
									background: TagContactsbtn ? '#EDF1F5' : '#FFFFFF',
									color: TagContactsbtn ? '#CED4DB' : '#00578E',
									border: "1px solid #b0b7c1",
									// border: TagContactsbtn ? "1px solid rgb(255 255 255)" : "1px solid #b0b7c1",
									// background:"#FFFFFF",
									// color:"#00578E",
									left: '85%',
									textTransform: "none"
								}}
								variant='outlined'
								disabled={TagContactsbtn}
								onClick={assignTagToContacts}
							>

								<span 
									// className={styles.addTagButtonText}
									>Tag Contacts</span>
							</Button>
						</div>
					</tr>
				</tbody>
			</table>

			<br></br>
			<div style={{ height: 500, width: '70%', marginLeft: '14%', marginBottom: '4%', display: 'contents' }}>

				<CustomDataGrid
					title="My Contacts"
					data={dataGridRows}		//dataGridRows
					columns={columns}
					options={options}
				/>

			</div>


			<AssignTagToContactsPopup
				open={tagContactsDialog}
				title={"Choose a Tag"}
				handleClose={handleDialogClose.bind(this)} />

			<div>
				<ViewContactTagsPopup
					
					open={tagPopupDialogOpen}
					handleClose={() => { setTagPopupDialogOpen(false) }} />

				{/* <ToastContainer pauseOnHover={false} position={'top-center'} /> */}

			</div>
		</div>
	);
};


export default AllUsers;