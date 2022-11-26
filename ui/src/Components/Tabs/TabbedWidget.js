import React,{ Component } from 'react';
import {Tabs, Tab, Paper} from  '@material-ui/core';

export default class TabbedWidget extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentIdx: this.props.tabIndex || 0
        }
    }

    componentDidMount = () => {
        if(this.props.resumeIdx) {
            this.changeTab(this.props.resumeIdx)
        }
    }
  
    handleChangeIdx = (event, value) => {
        this.setState({ currentIdx: value });
    }

    changeTab = (tabIndex) => {
        this.setState({ currentIdx: tabIndex });
    }

    getCurrentTabIndex = () => {
        return this.state.currentIdx;
    }

    buildTabLabels = (tabs) => {
        let labels = [];
        tabs.forEach(tab => {
            let tabLabel;
            if(tab.count) {
                tabLabel = <Tab style={{ textTransform: 'initial', fontWeight: '400', fontFamily: 'Open Sans' }} label={`${tab.label} (${tab.count})`} key={`${tab.label}`} />
            } else {
                tabLabel = <Tab style={{ textTransform: 'initial', fontWeight: '400', fontFamily: 'Open Sans' }} label={`${tab.label}`} key={`${tab.label}`} />
            }
            labels.push( tabLabel )
        });
        return labels;
    }

    render() {
        return(
            <div className="tabbedWidget" style={{width:(this.props.width)?this.props.width:'100%'}}>
                
                <Paper square style={{backgroundColor:'#f9f9f9'}}>
                    <Tabs value={this.state.currentIdx} onChange={this.handleChangeIdx}>
                        {this.buildTabLabels(this.props.tabLabels)}
                    </Tabs>
                </Paper>
                    
                {this.props.children[this.state.currentIdx]}
            </div>
       );
    }
}