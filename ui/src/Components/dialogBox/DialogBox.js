import React,{ Component } from 'react';
import { Dialog, DialogActions, Button, Typography, Divider, CircularProgress } from '@material-ui/core';

export default class DialogBox extends Component {
    constructor(props){
        super(props);
        
    }

    render() {
    
        return(
            <div>

                <Dialog open={this.props.open}
                        onClose={(this.props.type !== 'loader')?this.props.handleClose:undefined}
                        style={{minWidth: '350px'}}
                        PaperProps={{square:true}}
                        >
                    <div style={{ minWidth:'350px', backgroundColor: '#007bb6', padding: '20px' }}>
                        <span style={{ color: '#ffffff', fontFamily: 'Open Sans', fontWeight: '400' }}>
                            {this.props.title}
                        </span>
                    </div>
                    <div style={{padding: '20px'}}>
                    {(this.props.errMsg && this.props.infoMsg)?
                        <div style={{
                        color: '#ffffff',
                        padding: '5px',
                        display: (this.props.errMsg.trim().length > 0 || this.props.infoMsg.trim().length > 0) ? 'block' : 'none',
                        backgroundColor: (this.props.errMsg.trim().length > 0) ? '#e21a1a' : '#007bb6'
                    }}>
                        {this.props.errMsg}{this.props.infoMsg}
                    </div>
                :""    
                }
                    
                        {
                            (this.props.type !== 'loader') ?
                                <Typography variant="subtitle1">
                                    {this.props.message}
                                </Typography>
                            :
                            <div style={{textAlign: 'center'}}>
                                <CircularProgress />
                            </div>
                        }
                        
                    </div>
                    <Divider />
                    {
                        (this.props.type !== 'loader')?
                        
                        <DialogActions>
                            {this.props.buttons}
                            <Button style={{ color: '#007BB6', textTransform: 'initial' }} onClick={this.props.handleClose}>
                                {(this.props.defaultButton)? this.props.defaultButton:'OK'}
                            </Button>
                        </DialogActions>
                        : undefined
                    }
                </Dialog>
                
            </div>
       );
    }
}
