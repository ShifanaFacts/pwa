import React, { Component } from "react"
import { AppBar, Toolbar, Typography, IconButton, ListItemIcon, Icon, Collapse, Avatar, Drawer } from '@mui/material';
import { appPlatform } from "../../General/globals";
import {Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../General/commonFunctions";
import PureJSComponentFactory from '../Pages/Factory/pureJSComponentFactory';
import { appTheme, appDrawerWidth } from "../../General/globals";
import { styled, useTheme } from '@mui/material/styles';
import FactsGlobalSearchField from "./Controls/factsGlobalSearchField";

 class AppBarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDrawerOpen: false,
            openedMenus: []
        };
        let DrawerVisibility=localStorage.getItem("wasDrawerVisible")
        if(DrawerVisibility=="true"){
            this.state.isDrawerOpen=true;
        }
        else{
            this.state.isDrawerOpen=false;
        }
        this.loginSettings = GetControlPropertyFromStoreOrRefData("[_userinfo]");
        // if (this.loginSettings?.theme) this.loginSettings = { ...this.loginSettings, theme: JSON.parse(this.loginSettings?.theme) };
        // this.primaryColor = this.loginSettings?.theme?.palette?.primary?.main ?? "#3a62ab"
        this.primaryColor = appTheme?.palette?.primary?.main;
        this.thisYear = (new Date()).getFullYear();
        this.isIOS = navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent);

    }

    
    // async componentDidMount() {
    //     let _userMenu = await authServiceInstance.loadUserMenu({ userrole: this.props.userInfo?.userrole });
    //     this.setState({
    //         userMenu: _userMenu
    //     },
    //         () => {
    //             let currentPage = this.state.userMenu.filter(t => (t.homepage && t.homepage.toLowerCase() === "true"));
    //             // var actionArgsObj =  JSON.stringify(currentPage[0].actionargs ); 
    //             let actionArgsObj = JSON.parse(currentPage[0].actionargs);

    //             this.state.userMenu.map(t => {
    //                 let jobj = JSON.parse(t.actionargs);
    //                 t.docno = jobj.docno;
    //             });
    //             if (currentPage) this.props.executeMenuAction(actionArgsObj); //Need to consider the Page Click conflict later
    //         }
    //     );

    // }

    async componentDidMount(){
    let DrawerVisibility=localStorage.getItem("wasDrawerVisible")
    if(DrawerVisibility=="true"){
        this.props.setWidthFunc(true);
    }
    else{
        this.props.setWidthFunc(false);
    }
    }
    toggleDrawer(isDrawerOpen) {
        if(isDrawerOpen==true && this.state.isDrawerOpen==true) {
        isDrawerOpen=false;
        }
        this.setState({
            isDrawerOpen
        });
    }

    async menuItemClick(menuItem, hasChildren, isMenuOpen) {

        if (hasChildren) {
            if (isMenuOpen) {
                this.setState({
                    openedMenus: this.state.openedMenus.filter(t => t !== menuItem.menuid)
                });
            }
            else {
                this.setState({
                    openedMenus: [...this.state.openedMenus, menuItem.menuid]
                });
            }
        }
        else {
            //  window.location.hash = `#${hash}`;
            // console.log("Drawer Variant is ", this.state) 
            // debugger;
            // if (this.props.drawerVariant.drawerVariantValue !== "persistent")
            // { 
            //     this.toggleDrawer(false);
            //     this.props.setWidthFunc(false);
            // }
            if(this.props){
              if(this.props?.drawerVariant?.drawerVariantValue!="persistent"){
                this.state.isDrawerOpen = false;
                this.props.setWidthFunc(false);
              }
            }         

            window.history.pushState({}, '', '#/' + (menuItem?.permalink ?? ""));

            // window.location.hash = "#" + (menuItem?.permalink ?? "");
            await ExecuteLayoutEventMethods([{
                "exec": "setdataset",
                "args": {
                    "dset": "pagemenuinfo",
                    "data": menuItem
                }
            }],null, null, true);
            await ExecuteLayoutEventMethods(menuItem?.action, null, null, true);

            // this.props.executeMenuRouting({
            //     doctype: "page",
            //     docno: hash
            // });
        }
    }

    render() {
        // let reduxState = store.getState().login; //Redux 
        let scaff = new PureJSComponentFactory().scaffoldComponent(this.props.chld);
        let scafftitle = new PureJSComponentFactory().scaffoldComponent(this.props.titlepart);
        let appTitle = GetControlPropertyFromStoreOrRefData(this.props.title);
        let logoMime = "data:image/png;base64,";
        let factsLogo = "iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AcGCgEBtcH0+QAAAzBJREFUOMtNk0tvG2UYhZ/3mxnf4jixg+3EkKRZQC8gLlEpqhAEFakskZDaHb+Bn8IWiV8AQgIBEmGDqEAIsqlQKbAozYWQ2I4v8dge2/PNfC+LpFGPdDav9J7NeY6MRiMAUUVE8IwQ+J7JBIHkMaYIWtJUK6MoqXZCu3zcjRu7zUl5NElaH7xV+9wXIV8o+EWQMs6Vp7Gr9Ia22j6NV467s8ZRb/Zs59TWe0Nb7Q9teThJi9E0zTSWsv+8/2btN98munbvfm/ruDu7cXJqL3WHttYf2ko4TkrRLM3H1vmpA+VMAiiK50kBJe+HUfLSF/daHx12ZledU3GqOMeFRM5sRC5uqoKAATW+QD11Wk5SFYCMb1ivF9hYKZDPGoZRyuPjMYcnU5LUXQTpuX0R8UUQVWWtlufWZpXVWo6XN4p0Bpb7j0KuX14kjCzbO232mtGTAFFFjIJNU9KNlQLvblZ5uBciqmREqZU8TkeWT77e4/FRxIe3V7n5YgVVUKeqivpJ4sbl+cBeWS/x3U6b+bzHldU5cI7ACDevLbK90+b7nTa7zYi77zRQhaPOxCmkJk5cfHm16Fq9KYcnE8rzAdnAoCiqMJfzyGU9jBH+3h/x+6OQrVeWyPhGnVNnsoHJ/nUw8pYrOS4tF+gMYiZxiiAYI4RRQjRNUZQ3ri7y6vMLfPNLk6lNjQie8TxTGIys/+ufPW5fr1Kv5Phjb4Qaw8QqPz/oM5fzuLPV4L0bNb786ZiHu0OMiAcEvkDgeeLtNyds77S5tVnF8zwiC71hwmq9wLWNEv+2J3z67T7t/gwxgpy34KtqoqoqRmj2Znz2w380nsnxXDVHPusRjhP2WxEngxgUjBGcXpApvkLLM9IPPKmnTk3ilP1mdNH3EwpFzjl+ClIAv1TwH9zZqn/c7MevdwZ2rX+2haXBOFkYT9P8zLpMkqo4fepLFcABqR/4cvD2a5WvQH5EddFaVw7HyVI3tLVWP15p9mYrnUFc7w2TWje0S+E4mR9OkoJTHSWp9n1VpuNxMlOlBxhjCObzXlApBbkX1ucKIEVUF2zslgbjpHoyiOsH7eliL7TdXMbs/g/Z+L2xtJFi0QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0wNlQxMDowMTowMS0wNDowMJiycesAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMDZUMTA6MDE6MDEtMDQ6MDDp78lXAAAAAElFTkSuQmCC"
         return (
           <React.Fragment>
             <AppBar
               position="static"
               style={this.props?.style}
               className={appTheme.appbarClass}
             >
               <Toolbar>
                 <IconButton
                   edge="start"
                   color="inherit"
                   onClick={() => {
                     this.toggleDrawer(true);
                     this.props.setWidthFunc(true);
                   }}
                 >
                   <MenuIcon />
                 </IconButton>
                 {appTitle ? (
                   <Typography variant="h6" className="flex-grow">
                     {appTitle}
                   </Typography>
                 ) : (
                   <></>
                 )}
                 {scafftitle}
                 {this.props.pageInfo?.globalsearchfield ? (
                   <FactsGlobalSearchField
                     pageInfo={this.props.pageInfo}
                     userMenu={this.props.userMenu}
                     menuDropClick={this.menuItemClick}
                   ></FactsGlobalSearchField>
                 ) : (
                   <></>
                 )}
                 {scaff}
               </Toolbar>
             </AppBar>
             {/* <Drawer open={this.state.isDrawerOpen} onClose={() => this.toggleDrawer(false)}
                    classes={{ paper: "app-drawer" }} >
                    <div
                        style={{ backgroundColor: this.primaryColor, padding: "90px 5px 10px 10px" }}>
                        <span style={{ color: "#FFFFFF", fontSize: "15px" }}
                        >{this.loginSettings?.username}</span>
                    </div>
                    <List className="drawer-list"
                    >
                        {this.props.userMenu?.
                            filter(t => t.parentid?.toString() === '0' && t.showinmenu.toString() === "1")?.
                            map((menuItem, index) => (
                                this.getmenuItem(menuItem, index, 0)
                            ))}
                    </List>
                    <div className="copyright">
                        <img alt="FACTS"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AcGCgEBtcH0+QAAAzBJREFUOMtNk0tvG2UYhZ/3mxnf4jixg+3EkKRZQC8gLlEpqhAEFakskZDaHb+Bn8IWiV8AQgIBEmGDqEAIsqlQKbAozYWQ2I4v8dge2/PNfC+LpFGPdDav9J7NeY6MRiMAUUVE8IwQ+J7JBIHkMaYIWtJUK6MoqXZCu3zcjRu7zUl5NElaH7xV+9wXIV8o+EWQMs6Vp7Gr9Ia22j6NV467s8ZRb/Zs59TWe0Nb7Q9teThJi9E0zTSWsv+8/2btN98munbvfm/ruDu7cXJqL3WHttYf2ko4TkrRLM3H1vmpA+VMAiiK50kBJe+HUfLSF/daHx12ZledU3GqOMeFRM5sRC5uqoKAATW+QD11Wk5SFYCMb1ivF9hYKZDPGoZRyuPjMYcnU5LUXQTpuX0R8UUQVWWtlufWZpXVWo6XN4p0Bpb7j0KuX14kjCzbO232mtGTAFFFjIJNU9KNlQLvblZ5uBciqmREqZU8TkeWT77e4/FRxIe3V7n5YgVVUKeqivpJ4sbl+cBeWS/x3U6b+bzHldU5cI7ACDevLbK90+b7nTa7zYi77zRQhaPOxCmkJk5cfHm16Fq9KYcnE8rzAdnAoCiqMJfzyGU9jBH+3h/x+6OQrVeWyPhGnVNnsoHJ/nUw8pYrOS4tF+gMYiZxiiAYI4RRQjRNUZQ3ri7y6vMLfPNLk6lNjQie8TxTGIys/+ufPW5fr1Kv5Phjb4Qaw8QqPz/oM5fzuLPV4L0bNb786ZiHu0OMiAcEvkDgeeLtNyds77S5tVnF8zwiC71hwmq9wLWNEv+2J3z67T7t/gwxgpy34KtqoqoqRmj2Znz2w380nsnxXDVHPusRjhP2WxEngxgUjBGcXpApvkLLM9IPPKmnTk3ilP1mdNH3EwpFzjl+ClIAv1TwH9zZqn/c7MevdwZ2rX+2haXBOFkYT9P8zLpMkqo4fepLFcABqR/4cvD2a5WvQH5EddFaVw7HyVI3tLVWP15p9mYrnUFc7w2TWje0S+E4mR9OkoJTHSWp9n1VpuNxMlOlBxhjCObzXlApBbkX1ucKIEVUF2zslgbjpHoyiOsH7eliL7TdXMbs/g/Z+L2xtJFi0QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0wNlQxMDowMTowMS0wNDowMJiycesAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMDZUMTA6MDE6MDEtMDQ6MDDp78lXAAAAAElFTkSuQmCC">

                        </img>
                        <a href="facts.ae">FACTS LLC &copy; {this.thisYear} All Rights Reserved</a>
                    </div>

                </Drawer> */}
             <Drawer
               open={this.state.isDrawerOpen}
               onClose={() => this.toggleDrawer(false)}
               onOpen={() => this.toggleDrawer(true)}
               disableBackdropTransition={!this.isIOS}
               disableDiscovery={this.isIOS}
               disableSwipeToOpen={this.props?.disableswipe}
               classes={{ paper: "app-drawer" }}
               setContentWidth={appDrawerWidth}
               variant={this.props.drawerVariant.drawerVariantValue}
             >
               <div className="drawer-header" 
                 style={{
                   backgroundColor: this.primaryColor,
                   padding: "5px 10px 10px 10px",
                   display: "flex",
                   alignItems: "center",
                 }}
               >
                 {/* <div className="chevdesign" >
                    <IconButton onClick={() => {this.toggleDrawer(false);this.props.setWidthFunc(false)}}>
                      <ChevronLeftIcon />
                    </IconButton>
                    </div> */}
                 <Avatar  className="drawer-avatar" 
                   src={
                     this.loginSettings?.userimage
                       ? logoMime + this.loginSettings?.userimage
                       : "/logo.png"
                   }
                   style={{
                     border: "3px solid rgba(255,255,255, 0.30)",
                     background: "gainsboro",
                     height: "60px",
                     width: "60px",
                   }}
                 ></Avatar>
                 <div style={{ display: "block" }}>
                   <div  className="drawer-username" 
                     style={{
                       color: "#FFFFFF",
                       fontSize: "14px",
                       padding: "10px",
                       paddingBottom: "5px",
                       fontWeight: "600",
                     }}
                   >
                     {this.loginSettings?.username}
                   </div>
                   <div className="drawer-desig" 
                     style={{
                       color: "#FFFFFF",
                       fontSize: "12px",
                       paddingLeft: "10px",
                     }}
                   >
                     {this.loginSettings?.userdesig}
                   </div>
                 </div>
               </div>
               <List className="drawer-list">
                 {this.props.userMenu
                   ?.filter(
                     (t) =>
                       t.parentid?.toString() === "0" &&
                       t.showinmenu.toString() === "1"
                   )
                   ?.map((menuItem, index) =>
                     this.getmenuItem(menuItem, index, 0)
                   )}
               </List>
               <div className="copyright">
                 <img alt="FACTS" src={logoMime + factsLogo}></img>
                 <a href="http://facts.ae">
                   FACTS LLC &copy; {this.thisYear} All Rights Reserved
                 </a>
               </div>
             </Drawer>
           </React.Fragment>
         );
    }
  

    getmenuItem(menuItem, index, menuLevel) {
        let hasChildren = this.props.userMenu?.filter(t => t.parentid?.toString() === menuItem.menuid)?.length > 0;
        let isMenuOpen = this.state.openedMenus.includes(menuItem.menuid);

        return (
            <React.Fragment key={index}>
                <ListItem className="drawer-list-item" dense={true} key={index} button onClick={() => this.menuItemClick(menuItem, hasChildren, isMenuOpen)}
                    style={{ paddingLeft: `${10 * (menuLevel + 1)}px` }} >
                    <ListItemIcon className="drawer-list-itemicon" style={{ minWidth: "32px" }}><Icon className="drawer-list-icon">{menuItem.icon}</Icon></ListItemIcon>
                    <ListItemText primary={menuItem.caption} />
                    {hasChildren &&
                        (isMenuOpen ?
                            <Icon>expand_less</Icon> : <Icon>expand_more</Icon>)}
                </ListItem>
                {hasChildren &&
                    <Collapse in={isMenuOpen} timeout="auto" unmountOnExit >
                        <List className="drawer-list" disablePadding >
                            {this.props.userMenu?.
                                filter(t => t.parentid?.toString() === menuItem.menuid && t.showinmenu.toString() === "1")?.
                                map((submenuItem, subIndex) => (
                                    this.getmenuItem(submenuItem, subIndex, menuLevel + 1)
                                ))}
                        </List>
                    </Collapse>}
                {menuLevel === 0 && <Divider />}

            </React.Fragment>
        );
    }
}

export default AppBarComponent;