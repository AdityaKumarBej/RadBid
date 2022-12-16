import React, { Component } from 'react';
import { Dialog, DialogActions, Button, Typography, Divider, CircularProgress } from '@material-ui/core';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';
import { bgcolor } from '@mui/system';

export default class ViewContactTagsPopup extends Component {
    constructor(props) {
        super(props);
        this.TagData = ["Alternative Investments", "Children of Clients", "High Stisfaction"]
    }


    handleClick = () => {
        console.info('You clicked the Chip.');
    };

    handleDelete = () => {
        console.info('You clicked the delete icon.');
    };


    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.type !== 'loader' ? this.props.handleClose : undefined}
                    style={{ minWidth: '350px' }}
                    PaperProps={{ square: true }}
                >
                    <div style={{ minWidth: '350px', backgroundColor: '#007bb6', padding: '20px' }}>
                        <span style={{ color: '#ffffff', fontFamily: 'Open Sans', fontWeight: '400' }}>
                            {this.props.title}
                        </span>
                    </div>
                    <div style={{ padding: '20px' }}>
                        {this.props.errMsg && this.props.infoMsg ? (
                            <div
                                style={{
                                    color: '#ffffff',
                                    padding: '5px',
                                    display:
                                        this.props.errMsg.trim().length > 0 || this.props.infoMsg.trim().length > 0
                                            ? 'block'
                                            : 'none',
                                    backgroundColor: this.props.errMsg.trim().length > 0 ? '#e21a1a' : '#007bb6',
                                }}
                            >
                                {this.props.errMsg}
                                {this.props.infoMsg}
                            </div>
                        ) : (
                            ''
                        )}

                        {this.props.type !== 'loader' ?
                            (
                                //implement a text box/dropdown for assigning tags
                                <div>
                                    <Card sx={{ maxWidth: 500, bgcolor: '#F7F8FA' }}>
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ width: 100, height: 100 }} />
                                            }

                                            title="Mr.Bob Mathew Marshall"
                                            subheader="bob@broadridge.com"
                                        />

                                        <CardContent>
                                            <div>
                                                {this.TagData.map((tag, key) => {
                                                    return (
                                                        <Chip
                                                            size="medium"
                                                            key={key}
                                                            label={tag}
                                                            onClick={this.handleClick}
                                                            onDelete={this.handleDelete}
                                                            style={{ margin: 4, border: 'ridge', borderRadius: 20, color: '#00578E' }}
                                                        />
                                                    )
                                                })}

                                            </div>
                                        </CardContent>

                                    </Card>
                                </div>



                            ) :
                            (
                                <div style={{ textAlign: 'center' }}>
                                    <CircularProgress />
                                </div>
                            )}
                    </div>
                    <Divider />


                    {this.props.type !== 'loader' ?
                        (
                            <DialogActions>
                                {this.props.buttons}
                                <Button
                                    style={{ color: '#007BB6', textTransform: 'initial' }}
                                    onClick={this.props.handleClose}
                                >
                                    {this.props.defaultButton ? this.props.defaultButton : 'OK'}
                                </Button>
                            </DialogActions>
                        ) : undefined}
                </Dialog>
            </div>
        );
    }
}
