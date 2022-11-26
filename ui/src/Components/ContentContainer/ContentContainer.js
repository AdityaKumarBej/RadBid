import React, {Component} from 'react';
import { Paper, Divider, ButtonBase } from '@material-ui/core';
import styles from './ContentContainer.module.css';

export default class ContentContainer extends Component {

    constructor(props) {
        super(props);
        this.customRefs = {}
    }

    buildHeaderAction = (input, index) => {
        if(input.label) {
            return (
                <div key={'div' + index}>
                    <ButtonBase key={index} 
                                style={{ backgroundColor: '#006392', color: '#ffffff', padding: '10px', marginRight: '10px', boxShadow: '1px 1px 5px #676767' }}
                                onClick={input.handler}>
                                {input.label}
                    </ButtonBase>
                </div>
            )
        }
    }

    render() {
        let headerActions = [];

        if (this.props.headerActions) {
            this.props.headerActions.forEach((action, index) => {
                if (action && action.label) {
                    headerActions.push(
                        this.buildHeaderAction(action, index)
                    )
                }
            });
        }
        return (
            <Paper className={styles.contentContainer}
                style={{
                    minWidth: (this.props.minWidth) ? this.props.minWidth : '300px',
                    maxWidth: (this.props.maxWidth) ? this.props.maxWidth : undefined
                }}
            >
                <div className={styles.heading}>
                    {this.props.heading}
                    <div style={{ float: 'right', display: 'inline-flex' }}>
                        {headerActions}
                    </div>
                </div>
                <Divider />
                <div id="renderSection" className={styles.renderSection}>
                </div>
                {this.props.children}
            </Paper>
        )
    }

}