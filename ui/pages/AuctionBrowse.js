import React, { Component, useState, useEffect } from 'react';
import styles from './AuctionBrowse.module.css';
import Layout from '../src/Components/Layout/Layout';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';
import ExploreTabCards from '../src/Components/Cards/AuctionBrowseCards/AuctionBrowseCards';
import { AuctionsTabCardContainer } from '../src/Components/Cards/AuctionBrowseCards/AuctionBrowseCards'
import Avatar from '@mui/material/Avatar';
import TabbedWidget from '../src/Components/Tabs/TabbedWidget';
import TabContainer from '../src/Components/Tabs/TabbedContainer';
import { CustomDataGrid } from '../src/Components/Datagrid/DataGrid';
import { IconButton } from '@mui/material';
import { Replay } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { UI_CONTEXT_ROOT } from '../src/GlobalConfig';
import AssignTagToContactsPopup from '../src/BusinessComponents/Users/AssignTagToContactsPopup';
const dummyIntegrationCardsData = [
	{
		id: 1,
		status: 'Installed',
		title: 'SendGrid',
		content: 'Start sending transactional and marketing email in minutes.  Link your account to import your contacts and send content',
		logo: <Avatar alt="Remy Sharp" src="/Sendgrid.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />

	},
	{
		id: 2,
		status: 'Installed',
		title: 'Tifin Risk',
		content: `The world's first financial personality assessment.  Link your account to import your contacts and to send assessments automatically`,
		logo: <Avatar alt="Remy Sharp" src="/Tifin risk.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />
	},
	{
		id: 3,
		status: 'Installed',
		title: 'Calendly',
		content: `The perfect partner app to our desktop application, the new Calendly app lets you bring the power of scheduling with you on-the-go.  Link your account to import your contacts and to send assessments automatically`,
		logo: <Avatar alt="Remy Sharp" src="/Calendly.png" sx={{ width: 40, height: 40 }} style={{ borderRadius: '35%' }} />
	},
]
export default function AuctionBrowse(props) {

	const [tabLabels, setTabLabels] = useState([
		{ label: 'Explore', count: 0 },
		{ label: 'Listings', count: 0 },
		// { label: 'Campaign Instances', count: 0 }
		// { label: 'Pending Appointment', count: 0 }
	]);

	const tabbedWidgetRef = React.useRef(null)
	const [tabWidgetKey, setTabWidgetKey] = useState(Math.random());
	const [tabIndex, setTabIndex] = useState(0);
	const [dataGridRows, setDataGridRows] = useState([]);
	const [itemsCount, setItemsCount] = useState(0);
	const [updatetable, setUpdatetable] = useState(false);
	const [bidBox, setBidBox] = useState(false);
	const [initialBidPrice, setInitialBidPrice] = useState("");
	const [lastBidPrice, setLastBidPrice] = useState("");

	const handleClick = () => {
		console.info('You clicked the Chip');
	};


	const columns = [
		{
			label: 'ID', name: 'id', options: {
				display: false,
			}
		},
		{
			label: 'Item Name', name: 'item_name', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>ITEM NAME</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},

		{
			label: 'Tags', name: "tags", width: 500,
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
									return (

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
					// console.log("checking value", value);
					if (value === "Active") {
						return (
							<div className={styles.InWorkflowStatusBox}>
								<p className={styles.InWorkflowStatusText}>{value}</p>
							</div>
						)
					}

					else if (value === "Sold") {
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
			label: 'Date Posted', name: 'date_posted', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>DATE POSTED</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Date Sold', name: 'date_sold', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>DATE SOLD</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Expiry period', name: 'expiry_period', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>EXPIRY PERIOD</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Intial Price', name: 'sold_price', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>INITIAL PRICE</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
			}
		},
		{
			label: 'Last Bid Price', name: 'last_bid_price', width: 150,
			options: {
				customHeadLabelRender: () => (
					<p className={styles.columnHeader}>LAST BID PRICE</p>
				),
				customBodyRender: (value) => (
					<p className={styles.defaultColumnCells}>
						{value}
					</p>
				)
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
								console.log("check uid", tableMeta.rowData[0])
								alert('Page under development');
							}}
						>
							View Item
						</Button>


						<Button
							variant="contained"
							color="primary"
							size="medium"
							style={{ marginLeft: 16, borderRadius: 5, textTransform: "none", whiteSpace: "nowrap" }}
							onClick={() => {
								setInitialBidPrice(tableMeta.rowData[7]);
								setLastBidPrice(tableMeta.rowData[8])
								setBidBox(true);
							}}
						>
							Quick Bid
						</Button>
					</strong>
				)
			}
		},

	]


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
		},
		// customToolbar: () => {
		// 	return (
		// 		<IconButton onClick={() => refreshTable()}>
		// 			<Replay />
		// 		</IconButton>
		// 	)
		// }
	}
	useEffect(() => {
		let profile = JSON.parse(sessionStorage.getItem("profile"))
		// console.log("user profile", profile);
		// console.log("domain", profile.domain);
		// console.log("username", profile.username);

		// let reqConfig = {
		// 	headers: {
		// 		'x-gs-domain': profile.domain,
		// 		'x-gs-user': profile.username
		// 	}
		// }
		generateTableData();
	},[updatetable])

	
	const generateTableData = async () => {
		
		let itemsObj = [
			{
				id: 1,
				item_name: "Chalice",
				tags: ["Valuables", "High value"],
				status: "Active",
				date_posted: "10/09/2022",
				date_sold: "10/10/2022",
				expiry_period: "2 days",
				sold_price: "450$",
				last_bid_price: "900$"
			},
			{
				id: 2,
				item_name: "Crown",
				tags: ["Valuables"],
				status: "Sold",
				date_posted: "10/09/2022",
				date_sold: "10/10/2022",
				expiry_period: "2 days",
				sold_price: "50$",
				last_bid_price: "200$"
			},
		]

		setItemsCount(2);
		console.log("number of records in table", itemsObj.length)
		for (var i = (itemsObj).length - 1; i >= 0; i--) {

			let tempContactObj = {
				id: itemsObj[i].id,
				item_name: itemsObj[i].item_name,
				tags: itemsObj[i].tags.length > 0 ? (itemsObj[i].tags) : ["No Tags"],
				status: itemsObj[i].status,
				date_posted: itemsObj[i].date_posted,
				date_sold: itemsObj[i].date_sold,
				expiry_period: itemsObj[i].expiry_period,
				sold_price: itemsObj[i].sold_price,
				last_bid_price: itemsObj[i].last_bid_price,
				status:  itemsObj[i].status
			};
			setDataGridRows((dataGridRows) => [...dataGridRows, tempContactObj]);
		}
	}

	const renderAddAuctionItems = () => {
		console.log("redirecting to add auction items page");
		return (
			window.location = `${UI_CONTEXT_ROOT}/registerAuctionItem`
		)
	};

	const handleDialogClose = () => {
		setBidBox(false);
		setInitialBidPrice("");
		setLastBidPrice("");
		alert("Updating Auction Item Price");
	}

	let headerActions = [];
	headerActions.push({ label: 'Register Item +', handler: renderAddAuctionItems });
	

	return (
		<Layout>
			<ContentContainer
				heading='Users'
				headingOn="true"
				headerActions={headerActions}
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
					marginLeft: "-14%",
					bottom: '-550px'
				}}
			>
				<div>
					<div
						className={styles.frame257}
						style={{ background: 'linear-gradient(89.31deg, #D0D3FF 0%, #52579C 100%)', maxWidth: '1500px', height: '500px' }}
					>
						<div className={styles.ellipse1_1} />
						{/* <div className={styles.ellipse1_2} /> */}
						<div className={styles.frame259} style={{ marginTop: '55px' }}>
							<div className={styles.frame258}>
								<p className={styles.text2} style={{ marginTop: '70px' }}>
									Explore the items <br />
									listed for Auction
								</p>
							</div>
							<p className={styles.text3}>
								Browse through the items listed below. You can explore categorically through the various filters.
							</p>
						</div>
						<br />
					</div>
					<br />

					<TabbedWidget
						ref={tabbedWidgetRef}
						width='1500px'
						fontStyle='normal'
						fontWeight='600'
						fontSize='16px'
						position='relative'
						bottom='-499px'
						tabLabels={tabLabels}
						tabColor='primary'
						indicatorColor='secondary'
						key={tabWidgetKey}
						tabIndex={tabIndex}
						styledTabs={true}
					>
						<TabContainer>
							{/** * * * * *  Explore * * * * * */}
							<div style={{ marginLeft: '-4%' }}>
								<div className={styles.heading} style={{ marginTop: '-45%' }}></div>
								<div ><ExploreTabCards /></div>
							</div>
						</TabContainer>
						<TabContainer>
					<CustomDataGrid
						title="Items"
						data={dataGridRows}		//dataGridRows
						columns={columns}
						options={options}
					/>
				<AssignTagToContactsPopup
				initialBidPrice={initialBidPrice}
				lastBidPrice={lastBidPrice}
				open={bidBox}
				title={"Bid Auction Item"}
				handleClose={handleDialogClose.bind(this)} />
						</TabContainer>
					</TabbedWidget>
				</div>
			</ContentContainer>
		</Layout>
	);
}