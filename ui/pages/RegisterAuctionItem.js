import React, { Component } from 'react';
import {
    Step,
    Stepper,
    StepLabel,
    Divider,
    ButtonBase,
    TextField,
    Tooltip,
    CircularProgress
} from '@material-ui/core'
import { MdSearch } from 'react-icons/md';
import Layout from '../src/Components/Layout/Layout';
import styles from './UploadFile.module.css';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import ContentContainer from '../src/Components/ContentContainer/ContentContainer';
export default class RegisterAuctionItem extends Component {
    constructor() {
        super()
        this.state = {
            dialogOpen: false,
            dialogTitle: '',
            errorMsg: '',
            currentStep: 0,
            currentPageIdx: 1,
            errors: [],
            unitsToTransfer: "0",
            consideration: "0",
            intent: 'seller'
        }

        this.mandatoryElements = {
            1: ['itemName', 'itemDescription', 'itemTag', 'pricepoint'],
            2: [],
            3: []
        }

        this.noValidationPages = [0, 5];

        this.steps = [
            'Info',
            'Enter Item Details',
            'Confirm Details'
        ];
    }

    componentDidMount() {
        /** Fetch user profile from session */
        let profile = JSON.parse(sessionStorage.getItem('profile'));
        let selfDetails = this.buildSelfDetails(profile);
        this.setState({ profile: profile, ...selfDetails })
    }

    buildSelfDetails = (profile) => {
        let exchangeProfile = profile.exchangeProfile;
        let selfDetails = {}
        for (let key in exchangeProfile) {
            selfDetails[`${this.state.intent}_${key}`] = exchangeProfile[key];
        }

        return selfDetails;
    }

    revertToDashboard = () => {
        this.setState({ currentPageIdx: 0 })
    }

    submitAction = () => {

        let data = {};

        data["itemName"] = this.state.itemName;
        data["itemDescription"] = this.state.itemDescription;
        data["itemTag"] = this.state.itemTag;
        data["pricepoint"] = this.state.pricepoint;

        // data
        console.log("checking data", data);

    }

    validateAccountDetails = (intent) => {
        return new Promise((resolve, reject) => {
            /**
             * Check if current page is marked a no validation
             */
            if (this.noValidationPages.includes(this.state.currentStep)) {
                resolve();
            } else {

                /**
                 * Extract details from state
                 *  -> format <intent>_key
                 */
                let matchPattern = new RegExp(`^${intent}`); // This will result in a pattern thats either /^seller/ or /^buyer
                let keys = Object.keys(this.state).filter((key) => { return matchPattern.test(key) })

                let accountPayload = {};
                keys.forEach(key => {
                    accountPayload[key] = this.state[key]
                });

                /**
                 * Make axios call
                 */
                axios.post('/broker/validateDetails', { email: this.state.profile.email, broker: this.state.profile.exchangeProfile.brokers[0], accountPayload: accountPayload })
                    .then((response) => {
                        if (response.data.status) {
                            /** Everything cehcks out, move to next page */
                            this.setState({ errors: [], errorMsg: '', currentStep: (this.state.currentStep < this.steps.length) ? this.state.currentStep + 1 : this.state.currentStep })
                        } else {
                            /** There were validation errors -> Highlight whas wrong */
                            this.setState({ errors: response.data.errors, errorMsg: response.data.errMsg });
                        }
                    })
            }

        });
    }

    validateSecurity = () => {
        let fieldErrors = this.runValidation(this.state.currentStep);

        if (fieldErrors.length > 0) {
            this.setState({ errors: fieldErrors, errorMsg: 'Missing Data fields' })
        } else {
            /** We are on security page. Run additional validations */
            if (parseInt(this.state.unitsToTransfer) === 0) {
                this.setState({ errors: ['unitsToTransfer'], errorMsg: 'Units to transfer should be greater than zero' })
            } else if (parseInt(this.state.unitsToTransfer) > this.state.unitsAvailable) {
                this.setState({ errors: ['unitsToTransfer'], errorMsg: 'Units to transfer cannot be greater than Units Available' })
            } else {
                this.setState({ errors: [], errorMsg: '', currentStep: (this.state.currentStep < this.steps.length) ? this.state.currentStep + 1 : this.state.currentStep })
            }
        }
    }

    execAction = (intent) => {
        /**
         * Run initial field level validation to confirm all fields have been entered
         */
        let fieldErrors = this.runValidation(this.state.currentStep);
        if (fieldErrors.length > 0) {
            this.setState({ errors: fieldErrors, errorMsg: 'Missing Data Fields' });
            return;
        }
        this.setState({ errors: [], errorMsg: '', currentStep: (this.state.currentStep < this.steps.length) ? this.state.currentStep + 1 : this.state.currentStep })
    }

    runValidation = (wizardPageIndex) => {
        let errors = [];
        this.mandatoryElements[wizardPageIndex].forEach(element => {
            if (!this.state[element] || this.state[element].toString().trim().length === 0) {
                errors.push(element)
            }
        });
        return errors;
    }

    revertAction = () => {
        this.setState({ currentStep: (this.state.currentStep > 0) ? this.state.currentStep - 1 : this.state.currentStep })
    }

    renderForm = () => {
        if (this.state.currentStep === 0) {
            return this.renderInformationPage()
        } else if (this.state.currentStep === 1) {
            return this.renderSellerForm()
        } else {
            return this.renderConfirmation()
        }
    }

    nextToInfo = () => {
        this.setState({ errors: [], errorMsg: '', currentStep: (this.state.currentStep < this.steps.length) ? this.state.currentStep + 1 : this.state.currentStep })
    }
    renderInformationPage = () => {

        return (
            <div>
                <div className="blueSectionHeader" style={{ textAlign: 'center' }}>
                    <b>Important Info</b>
                </div>
                <div style={{ marginTop: '10px', padding: '0 40px 0 40px' }}>
                    <div style={{ textAlign: 'justify' }}>
                        <b>
                            Go through our form to register an item for auction into the system.
                        </b>
                    </div>

                    <br />
                  
                    <ButtonBase
                        style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                        onClick={this.nextToInfo}>
                        Proceed
                    </ButtonBase>
                </div>
            </div>
        )
    }

    renderSellerForm = () => {
        return (
            <div>
                <div className="blueSectionHeader">
                    Please enter item details
                </div>
                <div style={{ textAlign: 'center', color: '#cc0606' }}>{this.state.errorMsg}</div>
                <div style={{ marginTop: '10px' }}>
                    <table width="100%" cellPadding="10px">
                        <tbody>
                            <tr>
                                <td>{this.buildInputField('Item Name', 'itemName', 'text', true, false, true)}</td>
                            </tr>
                       
                            <tr>
                                <td colSpan="3">{this.buildInputField('Description', 'itemDescription', 'text', true, false, true)}</td>
                            </tr>
                            <tr>
                                <td>{this.buildInputField('Tag', 'itemTag', 'text', true, false, true)}</td>
                                <td>{this.buildInputField('Price', 'pricepoint', 'text', true, false, true)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <ButtonBase
                        style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                        onClick={() => this.execAction('seller')}>
                        Next
                    </ButtonBase>
                </div>
            </div>
        )
    }


    renderConfirmation = () => {
        return (
            <div>
                <div className="blueSectionHeader">
                    Please confirm details below. In case of edits, please click previous
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px' }}>
                    <table width="100%" cellPadding="10px">
                        <tbody>
                            <tr>
                                <td colSpan="6"><span style={{ fontFamily: 'Open Sans', fontSize: '20px', fontWeight: '100' }}>Item Details</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Item Name</td> <td>{this.state.itemName}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Item Description</td> <td>{this.state.itemDescription}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Tag</td> <td>{this.state.itemTag}</td>
                                <td style={{ fontWeight: 'bold' }}>Price</td> <td>{this.state.pricepoint}</td>
                            </tr>
                        
                         <tr><td colSpan="6"><Divider /></td></tr>
                       
                        </tbody>
                    </table>
                    <ButtonBase
                        style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                        onClick={this.submitAction}>
                        Submit Form
                    </ButtonBase>
                </div>
            </div>
        )
    }

    buildInputField = (label, name, type, required, disabled, fullWidth, handleEnter) => {
        return <TextField key={name}
            type={type}
            value={(this.state[name]) ? this.state[name] : ''}
            name={name}
            label={label}
            error={(required && this.state.errors.includes(name) ? true : false)}
            required={(required) ? required : false}
            disabled={(disabled) ? disabled : false}
            onChange={this.setValue}
            fullWidth={(fullWidth) ? fullWidth : false}
            InputLabelProps={{ style: { fontSize: 17 }, shrink: true }}
            size="small"
            variant="outlined"
            onKeyPress={(handleEnter) ? this.handleEnter : null}
        />
    }

    handleEnter = (event) => {
        if (event.key === 'Enter') {
            this.fetchSecurityDetails();
        }
    }

    setValue = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleDialogClose = () => {
        this.props.completionCallback();
    }

    render() {
        if (!this.state.profile) {
            return <div style={{ textAlign: 'center', padding: '10px' }}><CircularProgress style={{ width: '25px', height: '25px' }} /></div>
        } else {
            return (
                <div>
                    <Layout>
                  
            
									<Link href="/auctions">
										<ButtonBase
										>
											<BiArrowBack /> Items
										</ButtonBase>
									</Link>
			
                    <Stepper activeStep={this.state.currentStep}>
                        {
                            this.steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))
                        }
                    </Stepper>
                    {/* <ContentContainer
							width="98%"
							height="628px"
							headingOn="false"
							marginTop="2%"
						> */}
                         
                    <div style={{ marginTop: '5px' }}>
                        {
                            this.renderForm()
                        }
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        <ButtonBase
                            style={{ float: 'left', backgroundColor: (this.state.currentStep === 0) ? '#ababab' : '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                            onClick={this.revertAction}
                            disabled={(this.state.currentStep === 0) ? true : false}
                        >
                            Previous
                        </ButtonBase>
                    </div>
                    {/* </ContentContainer> */}
                    </Layout>
                </div>
            );
        }
    }
}