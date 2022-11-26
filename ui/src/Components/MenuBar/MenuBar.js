import React, {Component} from 'react';
import {
    ButtonBase,
    Popper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    Grow,
    Paper,
    StylesProvider
} from '@material-ui/core';
import { MdHome } from 'react-icons/md'
import Link from 'next/link';
import styles from './MenuBar.module.css';
import {UI_CONTEXT_ROOT} from '../../GlobalConfig';
import Backdrop from './img_hero_bg.png';

let menus = {
    'operator': {
        "menuItems": [
            {
                "id": "dashboard",
                "label": "Dashboard",
                "url": "/dashboard",
                "children": []
            },
            {
                "id": "history",
                "label": "History",
                "url": "/history",
                "children": []
            }
        ]
    }
}

export default class MenuBar extends Component {
    constructor(){
        super();
        this.state = {
            open: false,
            topMenu : [],
            childMenu : []
        }
        
        this.menuContent = {}
            
    }

    async componentDidMount(){
        this.menuContent = menus.operator;
        let urlPath=window.location.href.split('/');
        this.buildTopLevelMenu(urlPath[4].toString());
    }

    handleClick = (event, id) => {
        this.setState({
            childMenu: this.menuChilds[id],
            anchorEl: event.target,
            open: true,
            profile:profileObj
        });
    };

    handleClose = (event) => {
        if (this.state.anchorEl === event.target) {
            return;
        }

        this.setState({ open: false });
    };

    buildTopLevelMenu = (selectedItem,entityId) => {

        this.setState({topMenu:[]});
        //let topMenu = [<MenuButton key={"HOME"} index="HOME" ><Link href={`${UI_CONTEXT_ROOT}/`}><MdHome style={{ fontSize: '20px' }} /></Link></MenuButton>]
        let topMenu = [<MenuButton key={"HOME"} index="HOME" ><MdHome style={{ fontSize: '20px' }} /></MenuButton>]
        topMenu.push()
        if(this.menuContent) {
            this.menuContent.menuItems.forEach((element, index) => {
                let markup;
                let elementLabel;
                elementLabel = element.label
                if(element.url && element.url.trim().length > 0) {                    
                    if (element.url.substring(1)===selectedItem){
                        markup=<MenuButton key={index} bgcolor='#FFFFFF' textcolor='#00578E' index={index} handleClick={() => {window.location = `${UI_CONTEXT_ROOT}${element.url}`}}><div>{elementLabel}</div></MenuButton>                    
                    }
                    else{
                        markup =<MenuButton key={index} index={index} handleClick={() => {window.location = `${UI_CONTEXT_ROOT}${element.url}`}}><div>{elementLabel}</div></MenuButton>
                    }
                } else {
                    markup =
                        <MenuButton key={index} index={index} handleClick={(e) => this.handleClick(e, element.id)} mouseOver={(e) => this.handleClick(e, element.id)}>{elementLabel}</MenuButton>
                }
                topMenu.push(markup);
            });
    
            /** Build child menu trees */
            this.menuChilds = {}
            this.menuContent.menuItems.forEach(element => {
                if(element.children && element.children.length > 0) {
                    let childItems = [];
                    element.children.forEach((child, index) => {
                        childItems.push(
                            <MenuItem key={child.id} onClick={this.handleClose}>
                                <Link href={`${UI_CONTEXT_ROOT}${child.url}`}>
                                    <div style={{color:'#ffffff',fontSize: '12px'}}>{child.label}</div>
                                </Link>
                            </MenuItem>
                        );
                    });
                    this.menuChilds[element.id] = childItems;
                }
            });
        }

        this.setState({topMenu: topMenu})
    }


    buildChildMenu = (parentName) => {
        this.setState({childMenu : this.menuChilds[parentName]})
    }
    
    render(){
        return(
            <div className={styles.topMenuPanel} style={{backgroundImage: `url(${Backdrop})`}}>
                {this.state.topMenu}

                <Popper open={this.state.open} anchorEl={this.state.anchorEl} placement='bottom-start' transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{
                                transformOrigin: 'bottom-start'
                            }}
                        >
                            <Paper square={true} style={{ backgroundColor:'#004681'}}>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {this.state.childMenu}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
            
        );
    }
}

const MenuButton = (props) => {    
    return (
        <ButtonBase key={props.index} style={{ height: '100%',backgroundColor:props.bgcolor}} onClick={props.handleClick} onMouseOver={props.mouseOver}>
            <div className={styles.menuButton} style={{color:props.textcolor}}>
                {props.children}
            </div>
        </ButtonBase>
    )
}
