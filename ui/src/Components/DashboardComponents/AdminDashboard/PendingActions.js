import React, { Component, useState, useEffect } from 'react';
import styles from './PendingActions.module.css'
//import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckBox from 'react-animated-checkbox';
import useSound from 'use-sound';

import reactStringReplace from 'react-string-replace';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
const axios = require('axios').default;


export default function PendingActions(props) {

    const [isOpen, setIsopen] = useState(true);
    const [Trigger, setTrigger] = useState(false);
    const [action, setAction] = useState("undefined");

    const [doneflag, setDoneflag] = useState(false);
    const [cancelledflag, setCancelledflag] = useState(false);
    const [closing,setclosing]=useState(false);

    let start = false

    const DoneAction = (value) => {
        setAction(value);
        setDoneflag(!doneflag);
        playActive();
       
        window.setTimeout(()=>{
          
            setclosing(!closing);
        },10000);

        addEventListener('animationend',()=>{

            handle();
            
        },{once:true})


    }

    const CancelledAction = (value) => {
        setAction(value)
        setCancelledflag(!cancelledflag)
        playActive();

        window.setTimeout(()=>{

        let profile = JSON.parse(sessionStorage.getItem("profile"))
        console.log("the action on", props.uid, "is Cancelled");
        console.log("the reqconfig is", props.reqConfig);
        let action_selected = "cancelled";
        // let x = {
        //     params: {
        //         'task_state': action_selected
        //     },
        //     headers: {
        //         'accept': 'application/json',
        //         'x-gs-domain': profile.domain,
        //         'x-gs-user': profile.username
        //     }
        // }

        try {
            //axios.put(`${CAMPAIGN_API_URL}/usertasks/${value}?task_state=${action_selected}`, props.reqConfig).then(

            // axios.put(`${CAMPAIGN_API_URL}/usertasks/${props.uid}`, '', x).then(
            //     (response) => {
            //         console.log('the response is ', response);

            //         if (response.status === 200) {
            //             // toast.success("Updated! Please refresh page");
            //         } else {
            //             console.log('User task update failed', response);
            //             // toast.error("Failed to update");
            //         }
            //     },
            //     (err) => {
            //         // toast.error("Failed to update");
            //         console.log('some error', err);
            //     },
            // );
        } catch (error) {
            // toast.error("Failed to update");
            throw error;
        }

        
            setclosing(!closing);
        },10000);

        addEventListener('animationend',()=>{
            handle();
        },{once:true})

    }



    const handle = () =>{
        setTrigger(!Trigger);
    }

    const [playActive] = useSound(

        '/ClickSound.mp3',

        { volume: 2.25 }

    );

    const campaign = (campaign_uid, campaign_instance_uid) => {
        console.log("Campaign uid :", campaign_uid);
        console.log("campaign instance :", campaign_instance_uid)
    }


    const highlight = (text, description, name, contact_uid, campaign_name, campaign_uid, campaign_instance_uid) => {
        let descriptionString = reactStringReplace(text, description, (match, i) => (<span className={styles.description}>{match}</span>));
        let campaignString = reactStringReplace(descriptionString, campaign_name, (match, i) => (
            <span className={styles.names} onClick={() => campaign(campaign_uid, campaign_instance_uid)}>{match}</span>));
        let contact_profile_link = `/myContacts/contactProfile?uid=${contact_uid}`
        let newString = reactStringReplace(campaignString, name, (match, i) => (
            <Link href={contact_profile_link}><span className={styles.names}>{match}</span></Link>
        ));

        return (newString);
    }


    return (
        <div className={Trigger ? styles.clsBar : styles.actionBar} >
            <div style={{ justifyContent: "center" }} 
                className={closing?styles.closing:""}
                >
                <List>
                    <div>
                        <ListItem alignItems="center" key={props.key} className={styles.pendingList} >

                            <ListItemAvatar sx={{ width: 50, height: 50, bgcolor: '#FFFFFF', color: '#00578E' }}>
                                <Typography
                                    sx={{ display: 'flex', flexDirection: 'column', width: 40, height: 40 }}
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {props.icon}
                                </Typography>
                            </ListItemAvatar>

                            <ListItemText>
                                primary={
                                    <Typography
                                        sx={{ display: 'flex', flexDirection: 'column' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        <div className={styles.PAdescription}>
                                            <h2>{props.title}</h2>
                                            {highlight(props.text, props.description, props.name, props.contact_id, props.campaign_name, props.campaign_uid, props.campaign_instance_uid)}
                                        </div>
                                        <div>
                                            <h5><span className={styles.PAdescription}>{props.timestamp}</span></h5>
                                        </div>

                                    </Typography>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: "inline-flex", width: '100%', justifyContent: 'space-around' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            <div
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <div style={{
                                                    display: 'inline-flex',
                                                    gap: '50%',
                                                    //justifyContent:'center'
                                                }}>
                                                    <div>
                                                        <FormControlLabel
                                                            label="Done"
                                                            control={<CheckBox
                                                                checked={action === 'Done'}
                                                                disabled={action === 'Cancelled' ? true : false}
                                                                checkBoxStyle={{
                                                                    checkedColor: "#0BDA51",
                                                                    size: 26,
                                                                    unCheckedColor: "#abf7b1"
                                                                }}
                                                                duration={700}
                                                                onClick={() => DoneAction("Done")}

                                                            />}
                                                        //disabled={action==='Cancelled'? true:false}
                                                        />
                                                    </div>

                                                    <div>
                                                        <FormControlLabel
                                                            label="Cancelled"
                                                            style={{ position: 'relative', left: '4px' }}
                                                            control={<CheckBox
                                                                checked={action === 'Cancelled'}
                                                                disabled={action === 'Done' ? true : false}
                                                                checkBoxStyle={{
                                                                    checkedColor: "#FF0000",
                                                                    size: 26,
                                                                    unCheckedColor: "#FF8080"
                                                                }}
                                                                duration={700}
                                                                onClick={() => CancelledAction('Cancelled')}
                                                            />}
                                                        //disabled={action==='Done'? true :false}
                                                        />
                                                    </div>

                                                </div>
                                            </div>

                                        </Typography>

                                    </React.Fragment>
                                }
                            </ListItemText>
                        </ListItem>
                        <Divider component="li" key={props.key} />
                    </div>
                    {/* <Divider variant="inset" component="li" /> */}
                </List>
            </div>
            {/* <ToastContainer pauseOnHover={false} 
               position={'top-center'} 
                /> */}
        </div>
    )
}

