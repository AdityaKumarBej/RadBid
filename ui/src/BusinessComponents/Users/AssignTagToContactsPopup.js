import React, { Component, useState, useEffect } from 'react';
import { Dialog, DialogActions, Button, Typography, Divider, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField} from '@material-ui/core';
import { UI_CONTEXT_ROOT, CAMPAIGN_API_URL } from '../../GlobalConfig';


export default function AssignTagToContactsPopup(props) {

    const [reqConfig, setReqConfig] = useState({});

    
    const buildInputField = (label, name, type, required, disabled, fullWidth, handleEnter) => {
        return <TextField key={name}
            type={type}
            name={name}
            label={label}
            error={(required &&  false)}
            required={(required) ? required : false}
            disabled={(disabled) ? disabled : false}
            fullWidth={(fullWidth) ? fullWidth : false}
            InputLabelProps={{ style: { fontSize: 17 }, shrink: true }}
            size="small"
            variant="outlined"
        />
    }


    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.type !== 'loader' ? props.handleClose : undefined}
                style={{ minWidth: '350px' }}
                PaperProps={{ square: true }}
            >
                <div style={{ minWidth: '350px', backgroundColor: '#007bb6', padding: '20px' }}>
                    <span style={{ color: '#ffffff', fontFamily: 'Open Sans', fontWeight: '400' }}>
                        {props.title}
                    </span>
                </div>
                <div style={{ padding: '20px' }}>
                    {props.errMsg && props.infoMsg ? (
                        <div
                            style={{
                                color: '#ffffff',
                                padding: '5px',
                                display:
                                    props.errMsg.trim().length > 0 || props.infoMsg.trim().length > 0
                                        ? 'block'
                                        : 'none',
                                backgroundColor: props.errMsg.trim().length > 0 ? '#e21a1a' : '#007bb6',
                            }}
                        >
                            {props.errMsg}
                            {props.infoMsg}
                        </div>
                    ) : (
                        ''
                    )}

                    {props.type !== 'loader' ?
                        (
                            //implement a text box/dropdown for assigning tags
                            <div>
                                <FormControl sx={{ m: 1, minWidth: 120 }} style={{ width: '100%' }}  >

                                <table width="100%" cellPadding="10px">
                        <tbody>
                            
                            <tr>
                            <TextField key={'Your Bid Price'}
                                type='text'
                                name='Your Bid Price'
                                label='Your Bid Price'
                                disabled={false}
                                InputLabelProps={{ style: { fontSize: 17 }, shrink: true }}
                                size="small"
                                variant="outlined"
                                />
                            </tr>
                            <br/>
                            <tr>
                            <TextField key={'Last Bid Price'}
                                type='text'
                                name='Last Bid Price'
                                label='Last Bid Price'
                                disabled={true}
                                value={props.lastBidPrice}
                                InputLabelProps={{ style: { fontSize: 17 }, shrink: true }}
                                size="small"
                                variant="outlined"
                                />
                            </tr>
                            <br/>
                            <tr>
                            <TextField key={'Initial Bid Price'}
                                type='text'
                                name='Initial Bid Price'
                                label='Initial Bid Price'
                                disabled={true}
                                value={props.initialBidPrice}
                                InputLabelProps={{ style: { fontSize: 17 }, shrink: true }}
                                size="small"
                                variant="outlined"
                                />
                            </tr>
                          
                        </tbody>
                    </table>
                                  


                                   
                                    {/* <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        value={tagFormData}
                                        onChange={handleChange}
                                    >
                                        {
                                            tagData.map((dropdown) => (
                                                <MenuItem value={dropdown.value}>{dropdown.value}</MenuItem>
                                            ))
                                        }
                                    </Select> */}


                                </FormControl>
                            </div>
                        ) :
                        (
                            <div style={{ textAlign: 'center' }}>
                                <CircularProgress />
                            </div>
                        )}
                </div>
                <Divider />


                {props.type !== 'loader' ?
                    (
                        <DialogActions>
                            {props.buttons}
                            <Button
                                style={{ color: '#007BB6', textTransform: 'initial' }}
                                onClick={() => props.handleClose()}
                            >
                                {props.defaultButton ? props.defaultButton : 'OK'}
                            </Button>
                        </DialogActions>
                    ) : undefined}
            </Dialog>
        </div>
    );



}




