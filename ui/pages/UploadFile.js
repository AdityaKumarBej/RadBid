import React, { Component } from 'react';
import Layout from '../src/Components/Layout/Layout';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';
import { BiArrowBack } from 'react-icons/bi';
import { Button, ButtonBase } from '@material-ui/core';
import MenuItem from '@mui/material/MenuItem';
import styles from './UploadFile.module.css';
import Box from '@mui/material/Box';
import { parse } from 'papaparse';
import { DataGrid } from '@mui/x-data-grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import GroupIcon from '@mui/icons-material/Group';
import Badge from '@mui/material/Badge';
import MUIDataTable from 'mui-datatables';
import { withRouter } from 'next/router'
import { UI_CONTEXT_ROOT, CAMPAIGN_API_URL } from '../src/GlobalConfig';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ToastContainer, toast } from "react-toast";
import Link from 'next/link';

export default withRouter(class UploadFile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPageIdx: 0,
			fileName: undefined,
			fileSize: undefined,
			fileData: undefined,
			fileDataCopy: undefined,
			dropdownselected1: 'firstname',
			dropdownselected2: 'middleinitial',
			dropdownselected3: 'lastname',
			dropdownselected4: 'title',
			dropdownselected5: 'suffix',
			dropdownselected6: 'email',
			dropdownselected7: 'phone',
			dropdownselected8: 'dob',
			dropdownselected9: 'gender',
			dropdownselected10: 'address1',
			dropdownselected11: 'address2',
			dropdownselected12: 'city',
			dropdownselected13: 'country_code',
			dropdownselected14: 'zip_code',
			clicked: false,
			dropdownselectedlist: ['firstname', 'middleinitial', 'lastname', 'title', 'suffix', 'email', 'phone', 'dob', 'gender', 'address1', 'address2', 'city', 'country_code', 'zip_code'],
			open: false,
			openBack: false,
			selectedId: 0,
		};
		this.fileRef = React.createRef();
		this.mappedDataForReview = [];
	}

	componentDidMount() {
		let profile = JSON.parse(sessionStorage.getItem('profile'));
		console.log("user profile", profile);
		console.log("domain", profile.domain);
		console.log("username", profile.username);
		
		// let selected_id = this.props.router.query.selectedId;
		// console.log("selected id is", selected_id);
		// this.setState({selectedId: selected_id});

		// let reqConfig = {
		// 	headers: {
		// 		'x-gs-domain': profile.domain,
		// 		'x-gs-user': profile.username
		// 	}
		// }

		// this.setState({ reqConfig: reqConfig })

	}

	handleChange = (e) => {

		Array.from(e.target.files).forEach(async (file) => {
			console.log(file);
			console.log(file.type);
			if (file.type === 'text/csv' || 'application/vnd.ms-excel') {
				console.log('came to inside code');
				this.setState({ fileName: file.name });
				this.setState({ fileSize: file.size });
				
				const text = await file.text();
				const result = parse(text, { header: true, skipEmptyLines: 'greedy' });
				this.setState({ fileData: result.data }, () => {
					if (this.state.fileData.length !== 0) {
						this.setState({ currentPageIdx: 1 });
					}
					else {
						alert('Uploaded blank csv')
						// toast.error('Uploaded blank csv');
					}
				});
				console.log(this.state.fileData);
			}
		});
	};

	handleContinue = () => {
		//check this.state.fileData before progressing


		var dataBasekeys = [];
		var mappedData = [];
		var fileKeys = Object.keys(this.state.fileData[0]);
		dataBasekeys.push(
			this.state.dropdownselected1,
			this.state.dropdownselected2,
			this.state.dropdownselected3,
			this.state.dropdownselected4,
			this.state.dropdownselected5,
			this.state.dropdownselected6,
			this.state.dropdownselected7,
			this.state.dropdownselected8,
			this.state.dropdownselected9,
			this.state.dropdownselected10,
			this.state.dropdownselected11,
			this.state.dropdownselected12,
			this.state.dropdownselected13,
			this.state.dropdownselected14
		);
		console.log("dataBasekeys :", dataBasekeys);
		this.setState({ fileDataCopy: this.state.fileData }, () => {
			//this.mappedDataForReview = [];
			this.state.fileDataCopy.map((obj, index) => {
				// console.log("the dobs are", obj[fileKeys[8]].replace(/[^a-zA-Z0-9]/g, ''))
				// console.log("the genders are", (obj[fileKeys[9]]).toLowerCase())

				obj[dataBasekeys[0]] = obj[fileKeys[0]];
				delete obj[fileKeys[0]];

				obj[dataBasekeys[1]] = obj[fileKeys[1]];
				delete obj[fileKeys[1]];

				obj[dataBasekeys[2]] = obj[fileKeys[2]];
				delete obj[fileKeys[2]];

				obj[dataBasekeys[3]] = obj[fileKeys[3]];
				delete obj[fileKeys[3]];

				obj[dataBasekeys[4]] = obj[fileKeys[4]];
				delete obj[fileKeys[4]];

				obj[dataBasekeys[5]] = obj[fileKeys[5]];
				delete obj[fileKeys[5]];

				obj[dataBasekeys[6]] = obj[fileKeys[6]];
				delete obj[fileKeys[6]];

				obj[dataBasekeys[7]] = (obj[fileKeys[7]]);
				delete obj[fileKeys[7]];

				obj[dataBasekeys[8]] = obj[fileKeys[8]].toLowerCase();
				delete obj[fileKeys[8]];

				obj[dataBasekeys[9]] = (obj[fileKeys[9]])
				delete obj[fileKeys[9]];

				obj[dataBasekeys[10]] = (obj[fileKeys[10]])
				delete obj[fileKeys[10]];

				obj[dataBasekeys[11]] = (obj[fileKeys[11]])
				delete obj[fileKeys[11]];

				obj[dataBasekeys[12]] = (obj[fileKeys[12]])
				delete obj[fileKeys[12]];

				obj[dataBasekeys[13]] = (obj[fileKeys[13]])
				delete obj[fileKeys[13]];

				// obj.id=index+1

				mappedData.push(obj);

				//this.mappedDataForReview.push(obj);
			});
			this.setState({ currentPageIdx: 3 });
		})

		this.mappedDataForReview = mappedData;
		console.log(fileKeys);
		console.log("dataBasekeys :", dataBasekeys);
		console.log("mappedData :", mappedData);
		console.log("mappedDataForReview :", this.mappedDataForReview);

	};

	replaceSelected = (key, value) => {
		if (this.state.dropdownselected1 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected1)
			this.setState({ dropdownselected1: value });
			//return(dropdownselected1);
		}
		else if (this.state.dropdownselected2 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected2)
			this.setState({ dropdownselected2: value });
			//return(dropdownselected2);
		}
		else if (this.state.dropdownselected3 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected3)
			this.setState({ dropdownselected3: value });
			//return(dropdownselected3);
		}
		else if (this.state.dropdownselected4 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected4)
			this.setState({ dropdownselected4: value });
			//return(dropdownselected4);
		}
		else if (this.state.dropdownselected5 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected5)
			this.setState({ dropdownselected5: value });
			//return(dropdownselected5);
		}
		else if (this.state.dropdownselected6 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected6)
			this.setState({ dropdownselected6: value });
			//return(dropdownselected6);
		}
		else if (this.state.dropdownselected7 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected7)
			this.setState({ dropdownselected7: value });
			//return(dropdownselected7);
		}
		else if (this.state.dropdownselected8 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected8)
			this.setState({ dropdownselected8: value });
			//return(dropdownselected8);
		}
		else if (this.state.dropdownselected9 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected9)
			this.setState({ dropdownselected9: value });
			//return(dropdownselected9);
		}
		else if (this.state.dropdownselected10 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected10)
			this.setState({ dropdownselected10: value });
			//return(dropdownselected10);
		}
		else if (this.state.dropdownselected11 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected11)
			this.setState({ dropdownselected11: value });
			//return(dropdownselected11);
		}
		else if (this.state.dropdownselected12 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected12)
			this.setState({ dropdownselected12: value });
			//return(dropdownselected12);
		}
		else if (this.state.dropdownselected13 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected13)
			this.setState({ dropdownselected13: value });
			//return(dropdownselected13);
		}
		else if (this.state.dropdownselected14 === key) {
			//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected14)
			this.setState({ dropdownselected14: value });
			//return(dropdownselected14);
		}
	}

	handleDialogClose = () => {
		this.setState({ open: false });
		return (
			window.location = `${UI_CONTEXT_ROOT}/users`
		)

	}

	handleBackDialogClose = () => {
		this.setState({ openBack: false });
	}

	importContacts = () => {

		console.log("mappedDataForReview :", this.mappedDataForReview);
		console.log("checking this mann", this.state.fileData);

		let contacts = this.mappedDataForReview;

		let errorMsg = "";
		let missing_records = 0;
		let isFirstNameEmpty, isLastNameEmpty, isEmailEmpty, isDOBEmpty, isGenderEmpty = false;
		let isDateValid = 0;
		let isEmailValid = 0;
		let isGenderValid = 0;
		let isCountryCodeLengthValid = 0;
		let isCountryCodeValid = 0;
		let isZipCodeLengthValid = 0;
		let isZipCodeValid = 0;

		for (var i = 0; i < contacts.length; i++) {
			if ((contacts[i].firstname).length <= 0) {
				isFirstNameEmpty = true;
				missing_records++;
			}
			if ((contacts[i].lastname).length <= 0) {
				isLastNameEmpty = true;
				missing_records++;
			}
			if ((contacts[i].email).length <= 0) {
				isEmailEmpty = true;
				missing_records++;
			}
			if ((contacts[i].dob).length <= 0) {
				isDOBEmpty = true;
				missing_records++;
			}
			if ((contacts[i].gender).length <= 0) {
				isGenderEmpty = true;
				missing_records++;
			}
			//validating date format
			let dateValid = dateIsValid(contacts[i].dob);
			console.log("date valid is", dateValid, "for contact", contacts[i].firstname);
			if (dateValid === false) {
				isDateValid++;
			}


			//check if email is of correct format
			let emailValid = (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(contacts[i].email);
			console.log("emailValid is", emailValid, "for contact", contacts[i].firstname);
			if (emailValid === false) {
				isEmailValid++;
			}

			//check if gender has either "male", "female" or "unspecified"
			if (contacts[i].gender == "male" || contacts[i].gender == "female" || contacts[i].gender == "unspecified") {
				// console.log("valid gender");
			} else {
				isGenderValid++;
			}

			//check if country code matches rule  maxLength: 3 minLength: 0 pattern: ^[A-Z]*$
			if ((contacts[i].country_code).length > 0) {
				if (contacts[i].country_code.length > 3) {
					isCountryCodeLengthValid++;
				} else {
					let countryCodeValid = (/^[A-Z]*$/).test(contacts[i].country_code);
					if (countryCodeValid === false) {
						isCountryCodeValid++;
					}
				}
			}

			//check if zip code matches rule : maxLength: 8 minLength: 0 pattern: ^[A-Z0-9]*$
			if ((contacts[i].zip_code).length > 0) {
				if (contacts[i].zip_code.length > 8) {
					isZipCodeLengthValid++;
				} else {
					let zipCodeValid = (/^[A-Z0-9]*$/).test(contacts[i].zip_code);
					if (zipCodeValid === false) {
						isZipCodeValid++;
					}
				}
			}
		}

		if (isFirstNameEmpty) {
			errorMsg += "First Name, "
		}
		if (isLastNameEmpty) {
			errorMsg += "Last Name, "
		}
		if (isEmailEmpty) {
			errorMsg += "Email, "
		}
		if (isDOBEmpty) {
			errorMsg += "DOB, "
		}
		if (isGenderEmpty) {
			errorMsg += "Gender, "
		}

		if (isFirstNameEmpty || isLastNameEmpty || isEmailEmpty || isDOBEmpty || isGenderEmpty) {
			if (missing_records > 1) {
				errorMsg += "are missing for a few records ";
			} else {
				errorMsg += "is missing for a few records ";
			}
		}
		console.log("checkign numbers", isDateValid);
		if (isDateValid > 0) {
			if (missing_records === 0) {
				errorMsg += "Please ensure DOB is of the format YYYY-MM-DD. "
			} else {
				errorMsg += "and ensure DOB is of the format YYYY-MM-DD. "
			}
		}

		if (isEmailValid > 0) {
			if (missing_records === 0) {
				errorMsg += "Please check the format of the email. "
			} else {
				errorMsg += "and ensure email is of the correct format. "
			}
		}


		if (isGenderValid > 0) {
			if (missing_records === 0) {
				errorMsg += "Please ensure gender is either 'male', 'female' or 'unspecified'. "
			} else {
				errorMsg += "and ensure gender is either 'male', 'female' or 'unspecified'. "
			}
		}

		if (isCountryCodeLengthValid > 0 || isCountryCodeValid > 0) {
			if (missing_records === 0) {
				errorMsg += "Please ensure the country code is of the format maxLength: 3 minLength: 0 and of the pattern: ^[A-Z]*$'. "
			} else {
				errorMsg += "and ensure the country code is of the format maxLength: 3 minLength: 0 and of the pattern: ^[A-Z]*$'. "
			}
		}


		if (isZipCodeLengthValid > 0 || isZipCodeValid > 0) {
			if (missing_records === 0) {
				errorMsg += "Please ensure the zip code is of the format maxLength: 8 minLength: 0 pattern: ^[A-Z0-9]*$'. "
			} else {
				errorMsg += "and ensure the zip code is of the format maxLength: 8 minLength: 0 pattern: ^[A-Z0-9]*$'. "
			}
		}


		function dateIsValid(dateStr) {
			const regex = /^\d{4}-\d{2}-\d{2}$/;

			if (dateStr.match(regex) === null) {
				return false;
			}

			const date = new Date(dateStr);
			const timestamp = date.getTime();

			if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
				return false;
			}
			return date.toISOString().startsWith(dateStr);
		}

		if (errorMsg.length > 0) {
			console.log("error message is", errorMsg);
			// toast.error(errorMsg);
		} else {
			console.log("contacts uploaded!");

			if (this.mappedDataForReview.length > 0) {
				try {
					toast.success('Contacts Uploaded!');
					this.setState({ open: true });
					// axios.post(`${CAMPAIGN_API_URL}/contacts/`, this.mappedDataForReview, this.state.reqConfig).then(
					// 	(response) => {
					// 		console.log('the response is ', response);

					// 		if (response.status === 202) {
					// 			//alert('contacts uploaded');
					// 			this.setState({ open: true });
					// 		} else {
					// 			toast.error('Contacts upload failed');
					// 			console.log('Failed to Upload Contacts!', response);
					// 		}
					// 	},
					// 	(err) => {
					// 		toast.error('Contacts upload failed');
					// 		console.log('error', err);
					// 	},
					// );
					console.log('Creating campaign with object', this.state.campaignObj);

				} catch (error) {
					throw error;
				}
			}
		}

	};

	render() {
		if (this.state.currentPageIdx === 0) {
			return(
				<Layout>
					{
						<ContentContainer
							width="98%"
							height="628px"
							headingOn="false"
							marginTop="2%"
						>
							<div style={{ marginLeft: '5%' }}>
								<div className={styles.contactbutton}>
									<Link href="/users">
										<ButtonBase
										>
											<BiArrowBack /> Users
										</ButtonBase>
									</Link>
								</div>
								<div className={styles.headertext}>Upload your file</div>
								<div className={styles.statictext1}>
									All csv, .xls or .xlsx files are supported. RadBid will allow you to map
									columns after you upload the file.
								</div>
								<div className={styles.statictext2}>
									Not sure how to format your file? <a href='./template/contactsUpload.csv' style={{ color: '#00578E', cursor: 'pointer', textDecoration: 'none' }} download>Download</a>  our example file.
								</div>
								<div className={styles.statictext3}>Contacts</div> 
								<div
									draggable='true'
									style={{
										backgroundColor: '#F7F8FA',
										borderRadius: 16,
										width: '694px',
										height: '176px',
										padding: '60px',
										textAlign: 'center',
										position: 'relative;',
										top: '6%'
									}}
									onDragOver={(e) => {
										e.preventDefault();
									}}
									onDrop={(e) => {
										this.setState({ currentPageIdx: 1 });
										e.preventDefault();
										Array.from(e.dataTransfer.files).forEach(async (file) => {
											this.setState({ fileName: file.name });
											this.setState({ fileSize: file.size });
											const text = await file.text();
											const result = parse(text, { header: true });
											this.setState({ fileData: result.data });
											console.log(this.state.fileData);
										});
									}}
								>
									<ul>
										Drag and drop or{' '}
										<label
											onClick={() => this.fileRef.current.click()}
											style={{ color: '#00578E', cursor: 'pointer' }}
										>
											Choose a file
										</label>{' '}
										to upload your contacts
									</ul>
									<ul>All csv, .xls or .xlsx files are supported</ul>
								</div>


								<ButtonBase
									style={{
										float: 'left',
										backgroundColor: '#E1E5EB',
										color: '#B0B8C2',
										padding: '10px',
										marginTop: '30px',
										marginRight: '50px',
										borderRadius: 11,
										top: '7%'
									}}
									disabled={true}
								>
									Continue
								</ButtonBase>
								<input
									ref={this.fileRef}
									onChange={this.handleChange}
									multiple={false}
									type='file'
									hidden
								/>
								<ToastContainer pauseOnHover={false} position={'top-center'} />
							</div>
						</ContentContainer>
					}
				</Layout>
			)
		}
		if (this.state.currentPageIdx === 1) {
			return (
				<Layout>
					{
						<ContentContainer
							width="98%"
							height="628px"
							headingOn="false"
							marginTop="2%"
						>
							<div style={{ marginLeft: '5%' }}>
								<div className={styles.contactbutton}>
									<ButtonBase
										onClick={() => {
											window.location.pathname = `ui/users`;
										}}
									>
										<BiArrowBack /> Contacts
									</ButtonBase>
								</div>
								<div className={styles.headertext}>Upload your file</div>
								<div className={styles.statictext1}>
									All csv, .xls or .xlsx files are supported. Growth Station will allow you to map
									columns after you upload the file.
								</div>
								<div className={styles.statictext2}>
									Not sure how to format your file? Download our example file.
								</div>
								<div className={styles.statictext3}>Contacts</div>
								<div
									style={{
										backgroundColor: '#F7F8FA',
										borderRadius: 16,
										width: '694px',
										height: '176px',
										padding: '60px',
										textAlign: 'center',
									}}
								>
									<ul style={{ color: '#50555C', fontWeight: 600, fontSize: '16px' }}>
										{this.state.fileName}
									</ul>
									<ul style={{ color: '#9398A3', fontWeight: 400, fontSize: '14px' }}>
										{this.state.fileSize} Bytes
									</ul>
								</div>
								<ButtonBase
									style={{
										float: 'left',
										backgroundColor: '#FFFFFF',
										color: '#00578E',
										padding: '10px',
										marginTop: '30px',
										marginRight: '10px',
										borderRadius: 11,
										borderStyle: 'solid',
										borderColor: '#B0B8C2',
										borderWidth: '1px',
									}}
									onClick={() => {
										this.setState({ currentPageIdx: 0 });
									}}
								>
									Back
								</ButtonBase>
								<ButtonBase
									className={styles.continueBtn}
									style={{
										float: 'left',
										background: 'linear-gradient(247.73deg, #00A3D6 0%, #00578E 100%)',
										color: '#ffffff',
										padding: '10px',
										marginTop: '30px',
										marginRight: '10px',
										borderRadius: 11,
									}}
									onClick={() => {
										this.setState({ currentPageIdx: 2 });
									}}
								>
									Continue
								</ButtonBase>
							</div>
						</ContentContainer>
					}
				</Layout>
			);
		}
		if (this.state.currentPageIdx === 2) {
			const Data = [
				{
					id: 1,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[0],
					PREVIEWINFO: Object.values(this.state.fileData[0])[0],
					PROPERTY: '',
				},
				{
					id: 2,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[1],
					PREVIEWINFO: Object.values(this.state.fileData[0])[1],
					PROPERTY: '',
				},
				{
					id: 3,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[2],
					PREVIEWINFO: Object.values(this.state.fileData[0])[2],
					PROPERTY: '',
				},
				{
					id: 4,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[3],
					PREVIEWINFO: Object.values(this.state.fileData[0])[3],
					PROPERTY: '',
				},
				{
					id: 5,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[4],
					PREVIEWINFO: Object.values(this.state.fileData[0])[4],
					PROPERTY: '',
				},
				{
					id: 6,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[5],
					PREVIEWINFO: Object.values(this.state.fileData[0])[5],
					PROPERTY: '',
				},
				{
					id: 7,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[6],
					PREVIEWINFO: Object.values(this.state.fileData[0])[6],
					PROPERTY: '',
				},
				{
					id: 8,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[7],
					PREVIEWINFO: Object.values(this.state.fileData[0])[7],
					PROPERTY: '',
				},
				{
					id: 9,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[8],
					PREVIEWINFO: Object.values(this.state.fileData[0])[8],
					PROPERTY: '',
				},
				{
					id: 10,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[9],
					PREVIEWINFO: Object.values(this.state.fileData[0])[9],
					PROPERTY: '',
				},
				{
					id: 11,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[10],
					PREVIEWINFO: Object.values(this.state.fileData[0])[10],
					PROPERTY: '',
				},
				{
					id: 12,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[11],
					PREVIEWINFO: Object.values(this.state.fileData[0])[11],
					PROPERTY: '',
				},
				{
					id: 13,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[12],
					PREVIEWINFO: Object.values(this.state.fileData[0])[12],
					PROPERTY: '',
				},
				{
					id: 14,
					COLUMNLABELFROMFILE: Object.keys(this.state.fileData[0])[13],
					PREVIEWINFO: Object.values(this.state.fileData[0])[13],
					PROPERTY: '',
				},
			];

			const columns = [
				{
					headerName: 'COLUMN LABEL FROM FILE',
					field: 'COLUMNLABELFROMFILE',
					width: 400,
					color: '#00578E',
					style: { color: '#00578E' },
				},
				{ headerName: 'PREVIEW INFO', field: 'PREVIEWINFO', width: 400, editable: true },
				{
					headerName: 'PROPERTY',
					field: 'PROPERTY',
					width: 400,
					height: 300,

					renderCell: (params) => (
						<strong>


							<FormControl>
								<Select style={{ height: '300px', width: '300px' }}
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={params.id === 1 ?
										(this.state.dropdownselected1) : params.id === 2 ?
											(this.state.dropdownselected2) : params.id === 3 ?
												(this.state.dropdownselected3) : params.id === 4 ?
													(this.state.dropdownselected4) : params.id === 5 ?
														(this.state.dropdownselected5) : params.id === 6 ?
															(this.state.dropdownselected6) : params.id === 7 ?
																(this.state.dropdownselected7) : params.id === 8 ?
																	(this.state.dropdownselected8) : params.id === 9 ?
																		(this.state.dropdownselected9) : params.id === 10 ?
																			(this.state.dropdownselected10) : params.id === 11 ?
																				(this.state.dropdownselected11) : params.id === 12 ?
																					(this.state.dropdownselected12) : params.id === 13 ?
																						(this.state.dropdownselected13) : params.id === 14 ?
																							(this.state.dropdownselected14) : 'initial value'
									}
									label="databasefieldselection"
									onChange={(e) => {
										if (params.id == 1) {

											var present = this.state.dropdownselected1
											this.replaceSelected(e.target.value, present)
											// this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected1)
											// this.setState({dropdownselected1: e.target.value }, () => { this.setState({ dropdownselectedlist: [...this.state.dropdownselectedlist, this.state.dropdownselected1] }); console.log(this.state.dropdownselectedlist) })
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected1)
											this.setState({ dropdownselected1: e.target.value })
										}
										if (params.id == 2) {

											var present = this.state.dropdownselected2
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected2)
											this.setState({ dropdownselected2: e.target.value })
										}
										if (params.id == 3) {

											var present = this.state.dropdownselected3
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected3)
											this.setState({ dropdownselected3: e.target.value })
										}
										if (params.id == 4) {

											var present = this.state.dropdownselected4
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected4)
											this.setState({ dropdownselected4: e.target.value })
										}
										if (params.id == 5) {

											var present = this.state.dropdownselected5
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected5)
											this.setState({ dropdownselected5: e.target.value })
										}
										if (params.id == 6) {

											var present = this.state.dropdownselected6
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected6)
											this.setState({ dropdownselected6: e.target.value })
										}
										if (params.id == 7) {

											var present = this.state.dropdownselected7
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected7)
											this.setState({ dropdownselected7: e.target.value })
										}
										if (params.id == 8) {

											var present = this.state.dropdownselected8
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected8)
											this.setState({ dropdownselected8: e.target.value })
										}
										if (params.id == 9) {

											var present = this.state.dropdownselected9
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected9)
											this.setState({ dropdownselected9: e.target.value })
										}
										if (params.id == 10) {

											var present = this.state.dropdownselected10
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected10)
											this.setState({ dropdownselected10: e.target.value })
										}
										if (params.id == 11) {

											var present = this.state.dropdownselected11
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected11)
											this.setState({ dropdownselected11: e.target.value })
										}
										if (params.id == 12) {

											var present = this.state.dropdownselected12
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected12)
											this.setState({ dropdownselected12: e.target.value })
										}
										if (params.id == 13) {

											var present = this.state.dropdownselected13
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected13)
											this.setState({ dropdownselected13: e.target.value })
										}
										if (params.id == 14) {

											var present = this.state.dropdownselected14
											this.replaceSelected(e.target.value, present)
											//this.state.dropdownselectedlist = this.state.dropdownselectedlist.filter(item => item != this.state.dropdownselected14)
											this.setState({ dropdownselected14: e.target.value })
										}

									}}
									variant='standard'
								>
									<MenuItem value={'firstname'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >First Name <span style={{ color: 'red' }}>*</span></MenuItem>
									<MenuItem value={'middleinitial'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Middle Initial</MenuItem>
									<MenuItem value={'lastname'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Lastname <span style={{ color: 'red' }}>*</span></MenuItem>
									<MenuItem value={'title'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Title</MenuItem>
									<MenuItem value={'suffix'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Suffix</MenuItem>
									<MenuItem value={'email'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }}>Email <span style={{ color: 'red' }}>*</span></MenuItem>
									<MenuItem value={'phone'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Phone</MenuItem>
									<MenuItem value={'dob'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Date Of Birth <span style={{ color: 'red' }}>*</span></MenuItem>
									<MenuItem value={'gender'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Gender<span style={{ color: 'red' }}>*</span></MenuItem>
									<MenuItem value={'address1'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }}>Address1</MenuItem>
									<MenuItem value={'address2'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }}>Address2</MenuItem>
									<MenuItem value={'city'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }}>City</MenuItem>
									<MenuItem value={'country_code'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }}>Country code</MenuItem>
									<MenuItem value={'zip_code'} style={{ display: 'flex', justifyContent: 'left', padding: 7 }} >Zip code</MenuItem>

								</Select>
							</FormControl>



						</strong>
					),
				},
			];
			return (
				<Layout>
					{
						<ContentContainer
							width="100%"
							height="909px"
							headingOn="false"
							marginTop="2%"
						>
							<div style={{ marginLeft: '5%' }}>
								<div className={styles.contactbutton1}>
									<ButtonBase
										onClick={() => {
											window.location.pathname = `ui/users`;
										}}
									>
										<BiArrowBack /> Contacts
									</ButtonBase>
								</div>
								<div className={styles.headertext}>Map contacts to properties</div>
								<div className={styles.statictext1}>
									Each column header below should be mapped to a contact property. Some of these have
									already been mapped based on their names.
								</div>
								<div className={styles.statictext2}>Total properties matched: {Object.keys(this.state.fileData[0]).length} out of {this.state.dropdownselectedlist.length}</div>
								<div style={{ height: 500, width: '100%', marginTop: '20px' }}>
									<DataGrid
										rows={Data}
										columns={columns}
										// pagination
										pageSize={14}
										rowsPerPageOptions={[14]}
										onRowClick={(item) => console.log(item.row)}
										// hideFooterSelectedRowCount='true'
										onCellEditCommit={(GridCellEditCommitParams) => {
											// Clicking outside the cell vs enter/tab yields different results.
											console.log('test');
											console.log(GridCellEditCommitParams);
										}}
									/>
								</div>
								<ButtonBase
									style={{
										float: 'left',
										backgroundColor: '#FFFFFF',
										color: '#00578E',
										padding: '10px',
										marginTop: '30px',
										marginRight: '10px',
										borderRadius: 11,
										borderStyle: 'solid',
										borderColor: '#B0B8C2',
										borderWidth: '1px',
									}}
									onClick={() => {
										window.location.reload(false);
										this.setState({ currentPageIdx: 1 });
									}}
								>
									Back
								</ButtonBase>
								<ButtonBase
									className={this.state.dropdownselectedlist.includes('firstname') && this.state.dropdownselectedlist.includes('lastname') && this.state.dropdownselectedlist.includes('email') ? styles.continueBtn : ''}
									style={{ float: 'left', background: this.state.dropdownselectedlist.includes('firstname') && this.state.dropdownselectedlist.includes('lastname') && this.state.dropdownselectedlist.includes('email') ? 'linear-gradient(247.73deg, #00A3D6 0%, #00578E 100%)' : '#E1E5EB', color: this.state.dropdownselectedlist.includes('firstname') && this.state.dropdownselectedlist.includes('lastname') && this.state.dropdownselectedlist.includes('email') ? '#ffffff' : '#B0B8C2', padding: '10px', marginTop: '30px', marginRight: '10px', borderRadius: 11 }}
									onClick={this.handleContinue}
									disabled={this.state.dropdownselectedlist.includes('firstname') && this.state.dropdownselectedlist.includes('lastname') && this.state.dropdownselectedlist.includes('email') ? false : true}
								>
									Continue
								</ButtonBase>
							</div>
						</ContentContainer>
					}
				</Layout>
			);
		}
		if (this.state.currentPageIdx === 3) {
			console.log('length of mapped function', this.mappedDataForReview.length);

			const columns = [
				{
					name: 'firstname',
					label: 'First Name',
				},
				{
					name: 'middleinitial',
					label: 'Middle Name',
				},
				{
					name: 'lastname',
					label: 'Last Name',
				},
				{
					name: 'title',
					label: 'Title',
				},
				{
					name: 'suffix',
					label: 'Suffix',
				},
				{
					name: 'email',
					label: 'Email',
				},
				{
					name: 'phone',
					label: 'Phone',
				},
				{
					name: 'dob',
					label: 'Date of Birth',
				},
				{
					name: 'gender',
					label: 'Gender',
				},
				{
					name: 'address1',
					label: 'Address 1',
				},
				{
					name: 'address2',
					label: 'Address 2',
				},
				{
					name: 'city',
					label: 'City',
				},
				{
					name: 'country_code',
					label: 'Country code',
				},
				{
					name: 'zip_code',
					label: 'Zip code',
				},
			];

			const options = {
				filter: false,
				download: false,
				searchable: false,
				print: false,
				viewColumns: false,
				searchText: null,
				searchPlaceholder: null,
				selectableRows: 'none',
				rowsPerPage: 10,
				pagination: true,
			};

			return (
				<Layout>
					<ContentContainer
						width="98%"
						height="1079px"
						headingOn="false"
						marginTop="2%"
					>
						<div style={{ marginLeft: '5%' }}>
							<div className={styles.contactbutton2}>
								<ButtonBase
									onClick={() => {
										window.location.pathname = `ui/users`;
									}}
								>
									<BiArrowBack /> Contacts
								</ButtonBase>
							</div>
							<div className={styles.headertext}>Review your import</div>

							<div>
								<GroupIcon
									style={{
										top: '48px',
										position: 'relative',
										width: '30px',
										height: '30px',
										color: '#6CC6FF',
										borderRadius: '50%',
										borderStyle: 'solid',
										borderColor: '#6CC6FF',
										borderWidth: '1px',
										backgroundColor: '#E1E5EB',
									}}
								/>
							</div>

							<div className={styles.uploadedcontacts}>
								<Box>You uploaded {this.mappedDataForReview.length} contacts</Box>
							</div>

							<div style={{ width: '100%', marginTop: '40px' }}>
								<MUIDataTable
									title={'Contacts List'}
									data={this.mappedDataForReview}
									columns={columns}
									options={options}
								/>
							</div>

							<div
								style=
								{{
									marginTop: '13%',
									borderColor: '#6CC6FF'
								}}>
								<input
									type='checkbox'
									id='terms'
									name='terms'
									value='terms'
									style={{
										width: '20px',
										height: '20px',
										position: 'relative',
										top: '-135px',
										right: '5px'
									}}
									onClick={() => {
										this.setState({ clicked: true });
									}}
								></input>
								<label for='terms' className={styles.termscondition}>
									I agree that all contacts in this import are expecting to hear from my organization. I have prior
									relationship with these contacts and have emailed them at least once in the past
									year. I can confirm this list wasn’t purchased, rented, appended, or provided by a
									third party.
								</label>
							</div>

							<ButtonBase
								style={{
									float: 'left',
									backgroundColor: '#FFFFFF',
									color: '#00578E',
									padding: '10px',
									marginTop: '-6%',
									marginRight: '10px',
									borderRadius: 11,
									borderStyle: 'solid',
									borderColor: '#B0B8C2',
									borderWidth: '1px',
								}}
								onClick={() => {
									this.setState({ openBack: true });
								}}
							>
								Back
							</ButtonBase>


							<Dialog
								open={this.state.openBack}
								onClose={this.handleBackDialogClose}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
							>
								<DialogTitle id="alert-dialog-title">
									{"Note!"}
								</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">
										If you choose to go back from this step, your page would <b>refresh</b> and you would have to
										re-upload the csv file.
									</DialogContentText>
								</DialogContent>
								<DialogActions>

									<Button autoFocus onClick={() => window.location.reload(true)}>
										Go Back
									</Button>

									<Button autoFocus onClick={this.handleBackDialogClose}>
										Stay
									</Button>
								</DialogActions>
							</Dialog>


							<ButtonBase
								className={this.state.clicked ?styles.continueBtn:""}
								style={{
									float: 'left',
									background: this.state.clicked ? 'linear-gradient(247.73deg, #00A3D6 0%, #00578E 100%)' : '#E1E5EB',
									color: this.state.clicked ? '#ffffff' : '#B0B8C2',
									padding: '10px',
									marginTop: '-6%',
									right: '-80px',
									borderRadius: 11,
								}}
								disabled={this.state.clicked ? false : true}
								onClick={this.importContacts}
							>
								Import Contacts
							</ButtonBase>

							<Dialog
								open={this.state.open}
								onClose={this.handleDialogClose}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
							>
								<DialogTitle id="alert-dialog-title">
									{"Contacts Uploaded!"}
								</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">
										Congratulations on uploading your contacts! It is time to now bond with them
										through our application! Click <b>Proceed</b> to get redirected to the All Contacts page
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									{/* <Button onClick={() => { this.handleDialogClose }} autoFocus>
										PROCEED
									</Button> */}
									<Link href="/users">
										<Button autoFocus>
											PROCEED
										</Button>
									</Link>
								</DialogActions>
							</Dialog>
						</div>
					</ContentContainer>
					<ToastContainer delay={3000} position='top-center' />
					{/* <ToastContainer pauseOnHover={false} position={'top-center'} /> */}
				</Layout>
			);
		}

	




	}
})