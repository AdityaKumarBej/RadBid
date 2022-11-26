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
import { axios } from '../../../Axios';
import DialogBox from '../../../Components/dialogBox/DialogBox';

export default class Wizard_OMTCreation extends Component {
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
            1: ['seller_accountRegistrationName', 'seller_tradingAccountNumber', 'seller_srn_hinNumber', 'seller_registeredAddress', 'seller_state', 'seller_postCode', 'seller_country', 'seller_mobilePhone', 'seller_homePhone', 'seller_email'],
            2: ['asxCode', 'securityName', 'unitsAvailable', 'descriptionOfSecurities', 'dateOfTransfer', 'unitsToTransfer', 'consideration'],
            3: ['buyer_accountRegistrationName', 'buyer_tradingAccountNumber', 'buyer_srn_hinNumber', 'buyer_registeredAddress', 'buyer_state', 'buyer_postCode', 'buyer_country', 'buyer_mobilePhone', 'buyer_homePhone', 'buyer_email']
        }

        this.noValidationPages = [0, 5];

        this.steps = [
            'Info',
            'Enter Seller Details',
            'Enter Security Details',
            'Enter Buyer Details',
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

    fetchSecurityDetails = () => {
        this.setState({ errors: [], errorMsg: '' })
        let asxCodeFound = false;
        if (this.state.asxCode && this.state.asxCode.trim().length > 0) {
            asxCodeFound = true;
        }

        if (!asxCodeFound) {
            this.setState({ errors: 'asxCode' })
        } else {
            axios.get(`/security/${this.state.asxCode}`)
                .then((response) => {
                    if (!response.data.status) {
                        this.setState({ errorMsg: response.data.msg })
                    } else {
                        this.setState({
                            securityName: response.data.secData.securityName,
                            unitsAvailable: response.data.secData.unitsAvailable,
                            descriptionOfSecurities: response.data.secData.descriptionOfSecurity
                        })
                    }
                })
        }
    }

    submitAction = () => {

        let data = {};

        /** Get seller details */
        let pattern = new RegExp('^seller');
        let sellerKeys = Object.keys(this.state).filter((key) => { return pattern.test(key) })

        /** Get buyer details */
        pattern = new RegExp('^buyer');
        let buyerKeys = Object.keys(this.state).filter((key) => { return pattern.test(key) })

        /** Bundle above details into a data object */
        let keys = [...sellerKeys, ...buyerKeys];
        keys.forEach(key => {
            data[key] = this.state[key]
        });

        /** Add security details to data object */
        data["asxCode"] = this.state.asxCode,
            data["securityName"] = this.state.securityName,
            data["unitsAvailable"] = this.state.unitsAvailable,
            data["descriptionOfSecurities"] = this.state.descriptionOfSecurities,
            data["dateOfTransfer"] = this.state.dateOfTransfer,
            data["unitsToTransfer"] = this.state.unitsToTransfer.trim(),
            data["consideration"] = this.state.consideration.trim(),
            data["sessionEmail"] = this.state.entityName

        this.setState({ dialogOpen: true, dialogType: 'loader', dialogTitle: 'Submitting New OMT Form' })

        /** Submit contract creation request */
        axios.post('/submit/createContract', data)
            .then((response) => {
                if (!response.data.status) {
                    this.setState({ dialogOpen: true, dialogType: 'info', dialogTitle: 'Error', dialogMessage: 'OMT Proposal failed' })
                } else {
                    this.setState({ dialogOpen: true, dialogType: 'info', dialogTitle: 'Info', dialogMessage: 'OMT Proposal submitted successfully' })
                    //this.props.completionCallback();
                }
            })

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

        this.setState({ errors: [], errorMsg: '' });
        /**
         * Make axios call
         */
        axios.post('/broker/validateDetails', { email: this.state[`${intent}_email`], broker: this.state.profile.exchangeProfile.brokers[0], accountPayload: accountPayload })
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
        } else if (this.state.currentStep === 2) {
            return this.renderSecurityForm()
        } else if (this.state.currentStep === 3) {
            return this.renderBuyerForm()
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
                            The off Market Transfer Form is to be used if you wish to transfer a
                            holding of shares from one party to another without buying and selling
                            on the market.For use when transferring Issuer Sponsored holdings
                            Into your {this.state.profile.exchangeProfile.brokers[0]} Trading Account.
                        </b>
                        <ul>
                            <li>Any alteration made to this form MUST be initiated by both the Buyer(S) and Seller(S).</li>
                            <li>Any increase to the amoubt of securities being transerred will not be accepted, even if initialled, you will need to complete a new form without amendments to the amount.</li>
                            <li>The transfer of stocks could give rise to tax consequences. You should ensure that you have considered the tax implications of the transfer before completing and returning this form. Information in relation to the tax implications of stock transfers available on the ATO website. You should seek independent, professional tax before making any decision in relation to the transfer.</li>
                            <li>{this.state.profile.exchangeProfile.brokers[0]} is not a registered tax (financial) adviser under the Tax Agent Services Act 2009 and is unable to provide you with tax advice in relation to this communication.</li>
                            <li>It should be noted that if you are the Seller of Issuer Sponsored Holdings and not a {this.state.profile.exchangeProfile.brokers[0]} or a Bank customer, additional identification is required as per the <b >Identification  Requirements for Issuer Sponsored Holdings </b> sections.</li>
                        </ul>

                    </div>

                    <br />
                    <div>
                        <div id="PageTitle" style={{ color: "white", backgroundColor: "#00578E", textAlign: "center", justifyContent: "center", padding: '10px' }}><b>Read Before Proceeding</b></div>
                        <p>The following table outlines the types of Transfer that can be affected and the process. Please ensure a copy for your records is made prior to submission.</p>
                        <table style={{ width: "100%" }} cellPadding="10px">
                            <tbody>
                                <tr>
                                    <th style={{ background: "#00578E", textAlign: "center", color: "white", padding: '10px' }}>SELLER</th>
                                    <th style={{ background: "#00578E", textAlign: "center", color: "white", padding: '10px' }}>BUYER</th>
                                    <th style={{ background: "#00578E", textAlign: "center", color: "white", padding: '10px' }}>PROCESS</th>
                                    <th style={{ background: "#00578E", textAlign: "center", color: "white", padding: '10px' }}>{this.state.profile.exchangeProfile.brokers[0]} CHARGES</th>
                                </tr>

                                <tr>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer from your {this.state.profile.exchangeProfile.brokers[0]} CHESS Sponsored Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer to your {this.state.profile.exchangeProfile.brokers[0]} CHESS Sponsored Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ol>
                                            <li>Complete Transfer form</li>
                                            <li>Submit Form to {this.state.profile.exchangeProfile.brokers[0]}</li>
                                        </ol>
                                    </td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ul>
                                            <li>$54 per transfer.</li>
                                            <li>GST inclusive</li>
                                        </ul>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer from your {this.state.profile.exchangeProfile.brokers[0]} CHESS Sponsored Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer to an Issuer Sponsored Holding</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ol>
                                            <li>Complete Transfer form</li>
                                            <li>Submit Form to {this.state.profile.exchangeProfile.brokers[0]}</li>
                                        </ol>
                                    </td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ul>
                                            <li>$54 per transfer.</li>
                                            <li>GST inclusive</li>
                                        </ul>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer from your {this.state.profile.exchangeProfile.brokers[0]} CHESS Sponsored Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer to another Broker's CHESS Sponsored Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ol>
                                            <li>Contact to other Broker to initiate request</li>
                                        </ol>
                                    </td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ul>
                                            <li>No fee.</li>
                                            <li>The other Broker may charge you a fee</li>
                                        </ul>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer from another Broker's CHESS sponsores Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer to a {this.state.profile.exchangeProfile.brokers[0]} CHESS Sponsored Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ol>
                                            <li>Complete Transfer form</li>
                                            <li>Submit Form to {this.state.profile.exchangeProfile.brokers[0]}</li>
                                        </ol>
                                    </td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ul>
                                            <li>No fee.</li>
                                            <li>The other Broker may charge you a fee</li>
                                        </ul>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer your Issuer sponsored shares</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer to a {this.state.profile.exchangeProfile.brokers[0]} CHESS Sponsored Account</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ol>
                                            <li>Complete Transfer form</li>
                                            <li>Seller must complete<b> Identification Requirements for Issuer Sponsored Holdings</b>, section</li>
                                            <li>Email form and supporting documents to {this.state.profile.exchangeProfile.brokers[0]}</li>
                                        </ol>
                                    </td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ul>
                                            <li>No fee.</li>
                                            <li>The other Broker may charge you a fee</li>
                                        </ul>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer your Issuer sponsored shares</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>Transfer to an Issuer Sponsored Holding</td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ol>
                                            <li>Contact the relevant Share Registry and confirm process applicable</li>
                                        </ol>
                                    </td>
                                    <td style={{ borderBottom: '1px solid #ababab' }}>
                                        <ul>
                                            <li>{this.state.profile.exchangeProfile.brokers[0]} is unable to process this transfer</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                    Please enter Seller / Transferor details
                </div>
                <div style={{ textAlign: 'center', color: '#cc0606' }}>{this.state.errorMsg}</div>
                <div style={{ marginTop: '10px' }}>
                    <table width="100%" cellPadding="10px">
                        <tbody>
                            <tr>
                                <td><Tooltip placement="top-end" title="ACCOUNT REGISTRATION NAME OF SELLER:
                                  The given name and surnames of the seller(s).
                                  Deceased estates should read (the full name of the executors) as Executors of the estate of (name of deceased shareholder).
                                  For companies, insert the company legal name.
                                  For Superannuation fund, family trust or minor, if the trustee is an individual, please insert the trustee given names and surname.
                                  If the trustee is a company, please insert the company legal name.
                                  For account designation, ensure you insert the name of the superannuation fund, trust name as per trust deed, or minor's name as per birth certificate.
                                  " placement="top-start" arrow>{this.buildInputField('Account Registration Name', 'seller_accountRegistrationName', 'text', true, false, true)}</Tooltip></td>

                                <td>{this.buildInputField('Account Designation', 'seller_accountDesignation', 'text', false, false, true)}</td>
                                <td><Tooltip placement="top-end" title='TRADING A/C: Insert the Trading account number where securities are currently held(where applicable).' placement="top-start" arrow>
                                    {this.buildInputField('Trading Account Number', 'seller_tradingAccountNumber', 'text', true, false, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td><Tooltip placement="top-end" title={`PID (PARTICIPANT IDENTIFICATION NUMBER): Insert Participant Identification Number (if applicable). This is the Buyer’s sponsoring broker where security is held. (E.g. ${this.state.profile.exchangeProfile.brokers[0]}’s PID is 01402).`} placement="top-start" arrow>{this.buildInputField('PID (if Applicable)', 'seller_pid', 'text', false, false, true)}</Tooltip></td>
                                <td><Tooltip placement="top-end" title='SRN (SECURITYHOLDER REFERNCE NUMBER) or HIN (HOLDER IDENTIFICATION NUMBER):
                                        This number can be found on the issuer Holding statement or a CHESS holdings statement. For Issuer sponsored and broker sponsored holdings (uncertified), the buyer’s SRN or HIN must be quoted as confirmation of the buyer’s authority for the transfer to be processed. Failure to include the buyer’s SRN or HIN may result in the transfer being returned to you for clarification.' placement="top-start" arrow>
                                    {this.buildInputField('SRN/HIN Number', 'seller_srn_hinNumber', 'text', true, false, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td colSpan="3"><Tooltip placement="top-end" title='REGISTERED ADDRESS: Insert the full address including the postCode exactly as printed in buyer’s holding statement.' placement="top-start" arrow>{this.buildInputField('Registered Address', 'seller_registeredAddress', 'text', true, false, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td>{this.buildInputField('State', 'seller_state', 'text', true, false, true)}</td>
                                <td>{this.buildInputField('Post Code', 'seller_postCode', 'text', true, false, true)}</td>
                                <td>{this.buildInputField('Country', 'seller_country', 'text', true, false, true)}</td>
                            </tr>
                            <tr>
                                <td><Tooltip placement="top-end" title='CONTACT PHONE NUMBER OF SELLER: Insert the seller’s contact phone number(s) including area code.' placement="top-start" arrow>{this.buildInputField('Mobile Phone', 'seller_mobilePhone', 'text', true, false, true)}</Tooltip></td>
                                <td>{this.buildInputField('Home Phone', 'seller_homePhone', 'text', true, false, true)}</td>
                                <td>{this.buildInputField('Email', 'seller_email', 'text', true, false, true)}</td>
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

    renderSecurityForm = () => {
        return (
            <div>
                <div className="blueSectionHeader">
                    Please enter Security details
                </div>
                <div style={{ textAlign: 'center', color: '#cc0606' }}>{this.state.errorMsg}</div>
                <div style={{ marginTop: '10px' }}>
                    <table width="100%" cellPadding="10px">
                        <tbody>
                            <tr>
                                <td><Tooltip placement="top-end" title='ASX CODE: The unique trading code of the security used by
                                        the australian Stock Exchange (ASX)(e.g the ASX code for the
                                        Commonwealth Bank is CBA for Wolworths Limited is WOW, for
                                        Reef Casino Trust is RTC, etc)' placement="top-start" arrow>
                                    {this.buildInputField('ASX Code', 'asxCode', 'text', true, false, true, true)}</Tooltip></td>

                                <td><ButtonBase style={{ padding: '5px' }}><MdSearch style={{ fontSize: '25px' }} onClick={this.fetchSecurityDetails} /></ButtonBase></td>
                            </tr>
                            <tr>
                                <td colSpan="3"><Divider /></td>
                            </tr>
                            <tr>
                                <td><Tooltip placement="top-end" title='SECURITY NAME: The full name of the company or trust in which
                                        the securities are held (e.g. Commonwealth Bank of Australia' placement="top-start" arrow>
                                    {this.buildInputField('Security Name', 'securityName', 'text', true, true, true)}</Tooltip></td>

                                <td><Tooltip placement="top-end" title='UNITS: Number of securities being transferred (in both numbers and words).' placement="top-start" arrow>
                                    {this.buildInputField('Units Available', 'unitsAvailable', 'number', true, true, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td colSpan="3"><Tooltip placement="top-end" title='DESCRIPTION OF SECURITIES: e.g. Fully paid Ordinary 50 cent Shares, 9% Unsecured Convertible Notes, etc. 
                                        This can be found on the certificate or statement.' placement="top-start" arrow>
                                    {this.buildInputField('Description of Security', 'descriptionOfSecurities', 'text', true, true, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td colSpan="3"><Divider /></td>
                            </tr>
                            <tr>
                                <td><Tooltip placement="top-end" title='DATE OF TRANSFER: Insert date of transfer. 
                                    Please note this not the date of the purchase agreement but the date of completion of the transfer.
                                    This should be on or before the date in points 20 and 22' placement="top-start" arrow>
                                    {this.buildInputField('Date of Transfer', 'dateOfTransfer', 'date', true, false, true)}</Tooltip></td>

                                <td><Tooltip placement="top-end" title='UNITS: Number of securities being transferred (in both numbers and words).' placement="top-start" arrow>
                                    {this.buildInputField('Units To Transfer', 'unitsToTransfer', 'number', true, false, true)}</Tooltip></td>

                                <td><Tooltip placement="top-end" title='CONSIDERATION: The full amount paid in settlement of the transfer of securities. 
                                            You may set your own consideration.' placement="top-start" arrow>
                                    {this.buildInputField('Consideration', 'consideration', 'number', true, false, true)}</Tooltip></td>
                            </tr>
                        </tbody>
                    </table>
                    <ButtonBase
                        style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                        onClick={this.validateSecurity}>
                        Next
                    </ButtonBase>
                </div>

            </div>
        )
    }

    renderBuyerForm = () => {
        return (
            <div>
                <div className="blueSectionHeader">
                    Please enter Buyer / Transferee details
                </div>
                <div style={{ textAlign: 'center', color: '#cc0606' }}>{this.state.errorMsg}</div>
                <div style={{ marginTop: '10px' }}>
                    <table width="100%" cellPadding="10px">
                        <tbody>
                            <tr>
                                <td><Tooltip placement="top-end" title='ACCOUNT REGISTRATION NAME OF BUYER: Full names of all buyer(a maximum of three joint holders).
                                  Securities can only be registered in the name of a living person or an incorporated company.
                                  For companies, insert the company legal name. Securities may not be registered in the name(s) 
                                  of a firm or business name, an estate or deceased  person, fund or a trust, although these may
                                  be inserted as abn account designation underneath the registered names. Some companies may also 
                                  have restrictions on minors being registered(e.g BHP and CBA).
                                  if the trust or superannuation  fund trustee is an individual, please 
                                  insert the trustee given names and surnames.
                                  if the trustee is a company,please insert the company legal name.
                                  `For account designation, ensure you insert name of the Superannuation fund, trust name as per 
                                  trust deed, or minor`s name as per birth certificate.' placement="top-start" arrow>
                                    {this.buildInputField('Account Registration Name', 'buyer_accountRegistrationName', 'text', true, false, true)}</Tooltip></td>

                                <td>{this.buildInputField('Account Designation', 'buyer_accountDesignation', 'text', false, false, true)}</td>

                                <td><Tooltip placement="top-end" title='TRADING A/C: Insert the account number where securities are to be held(where applicable).' placement="top-start" arrow>
                                    {this.buildInputField('Trading Account Number', 'buyer_tradingAccountNumber', 'text', true, false, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td><Tooltip placement="top-end" title={`PID (PARTICIPANT IDENTIFICATION NUMBER): Insert Participant  identification Number(If applicable). this 
                                        is the buyer's sponsoring broker where security will be held. (E.g ${this.state.profile.exchangeProfile.brokers[0]}'s PID is 01402).`} placement="top-start" arrow>
                                    {this.buildInputField('PID (if Applicable)', 'buyer_pid', 'text', false, false, true)}</Tooltip></td>

                                <td><Tooltip placement="top-end" title='SRN (SECURITYHOLDER REFERENCE NUMBER) or HIN (HOLDER IDENTIFICATION NUMBER): The buyer`s SRN or HIN
                                      may be inserted, if known, so that any previous holdings can be amalgamated.' placement="top-start" arrow>
                                    {this.buildInputField('SRN/HIN Number', 'buyer_srn_hinNumber', 'text', true, false, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td colSpan="3"><Tooltip placement="top-end" title='REGISTERED ADDRESS: Insert the full address including the postCode exactly as printedon buyer`s 
                                     holding statement.' placement="top-start" arrow>{this.buildInputField('Registered Address', 'buyer_registeredAddress', 'text', true, false, true)}</Tooltip></td>
                            </tr>
                            <tr>
                                <td>{this.buildInputField('State', 'buyer_state', 'text', true, false, true)}</td>
                                <td>{this.buildInputField('Post Code', 'buyer_postCode', 'text', true, false, true)}</td>
                                <td>{this.buildInputField('Country', 'buyer_country', 'text', true, false, true)}</td>
                            </tr>
                            <tr>
                                <td><Tooltip placement="top-end" title='
                                       CONTACT PHONE NUMBER OF BUYER: Insert the full address including area code.' placement="top-start" arrow>
                                    {this.buildInputField('Mobile Phone', 'buyer_mobilePhone', 'text', true, false, true)}</Tooltip></td>

                                <td>{this.buildInputField('Home Phone', 'buyer_homePhone', 'text', true, false, true)}</td>
                                <td>{this.buildInputField('Email', 'buyer_email', 'text', true, false, true)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <ButtonBase
                        style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                        onClick={() => this.execAction('buyer')}>
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
                                <td colSpan="6"><span style={{ fontFamily: 'Open Sans', fontSize: '20px', fontWeight: '100' }}>Seller Details</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Account Registration Name</td> <td>{this.state.seller_accountRegistrationName}</td>
                                <td style={{ fontWeight: 'bold' }}>Account Designation</td> <td>{this.state.seller_accountDesignation}</td>
                                <td style={{ fontWeight: 'bold' }}>Trading Account Number</td> <td>{this.state.seller_tradingAccountNumber}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>PID (If Applicable)</td> <td>{this.state.seller_pid}</td>
                                <td style={{ fontWeight: 'bold' }}>SRN/HIN Number</td> <td>{this.state.seller_srn_hinNumber}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Registered Address</td> <td>{this.state.seller_registeredAddress}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>State</td> <td>{this.state.seller_state}</td>
                                <td style={{ fontWeight: 'bold' }}>PostCode</td> <td>{this.state.seller_postCode}</td>
                                <td style={{ fontWeight: 'bold' }}>Country</td> <td>{this.state.seller_country}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Mobile Phone</td> <td>{this.state.seller_mobilePhone}</td>
                                <td style={{ fontWeight: 'bold' }}>Home Phone</td> <td>{this.state.seller_homePhone}</td>
                                <td style={{ fontWeight: 'bold' }}>Email</td> <td>{this.state.seller_email}</td>
                            </tr>

                            <tr><td colSpan="6"><Divider /></td></tr>
                            <tr>
                                <td colSpan="6"><span style={{ fontFamily: 'Open Sans', fontSize: '20px', fontWeight: '100' }}>Security Details</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>ASX Code</td> <td>{this.state.asxCode.toUpperCase()}</td>
                                <td style={{ fontWeight: 'bold' }}>Security Name</td> <td>{this.state.securityName}</td>
                                <td style={{ fontWeight: 'bold' }}>Units Available</td> <td>{this.state.unitsAvailable}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Description of Security</td> <td colSpan="5" >{this.state.descriptionOfSecurities}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Date of Transfer</td> <td>{this.state.dateOfTransfer}</td>
                                <td style={{ fontWeight: 'bold' }}>Units to Transfer</td> <td>{this.state.unitsToTransfer}</td>
                                <td style={{ fontWeight: 'bold' }}>Consideration</td> <td>{this.state.consideration}</td>
                            </tr>
                            <tr><td colSpan="6"><Divider /></td></tr>
                            <tr>
                                <td colSpan="6"><span style={{ fontFamily: 'Open Sans', fontSize: '20px', fontWeight: '100' }}>Buyer Details</span></td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Account Registration Name</td> <td>{this.state.buyer_accountRegistrationName}</td>
                                <td style={{ fontWeight: 'bold' }}>Account Designation</td> <td>{this.state.buyer_accountDesignation}</td>
                                <td style={{ fontWeight: 'bold' }}>Trading Account Number</td> <td>{this.state.buyer_tradingAccountNumber}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>PID (If Applicable)</td> <td>{this.state.buyer_pid}</td>
                                <td style={{ fontWeight: 'bold' }}>SRN/HIN Number</td> <td>{this.state.buyer_srn_hinNumber}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Registered Address</td> <td>{this.state.buyer_registeredAddress}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>State</td> <td>{this.state.buyer_state}</td>
                                <td style={{ fontWeight: 'bold' }}>PostCode</td> <td>{this.state.buyer_postCode}</td>
                                <td style={{ fontWeight: 'bold' }}>Country</td> <td>{this.state.buyer_country}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>Mobile Phone</td> <td>{this.state.buyer_mobilePhone}</td>
                                <td style={{ fontWeight: 'bold' }}>Home Phone</td> <td>{this.state.buyer_homePhone}</td>
                                <td style={{ fontWeight: 'bold' }}>Email</td> <td>{this.state.buyer_email}</td>
                            </tr>
                            <tr><td colSpan="6"><Divider /></td></tr>
                        </tbody>
                    </table>
                    <ButtonBase
                        style={{ float: 'right', backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px' }}
                        onClick={this.submitAction}>
                        Submit OMT Form
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
                    <Stepper activeStep={this.state.currentStep}>
                        {
                            this.steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))
                        }
                    </Stepper>
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
                    <DialogBox type={this.state.dialogType} open={this.state.dialogOpen} title={this.state.dialogTitle} message={this.state.dialogMessage} handleClose={() => { this.setState({ dialogOpen: false }), this.handleDialogClose() }} />
                </div>
            );
        }
    }
}