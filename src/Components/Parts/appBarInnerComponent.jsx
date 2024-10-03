import { AppBar, Toolbar, IconButton, Typography, Icon } from "@mui/material";
import React, { Component } from "react";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../General/commonFunctions";
import { appTheme, appPlatform } from "../../General/globals";
import PureJSComponentFactory from "../Pages/Factory/pureJSComponentFactory";

class AppBarInnerComponent extends Component {

    constructor(props) {
        super(props);
        let myTitle = GetControlPropertyFromStoreOrRefData(props.title);
        this.state = {
            title: myTitle
        }

    }

    componentWillReceiveProps(nextProps) {
        let myTitle = GetControlPropertyFromStoreOrRefData(nextProps.title);
        if (this.state.title !== myTitle) {

            this.setState({
                title: myTitle
            });
        }
    }
    async handleBackClick(clickArgs) {
        await ExecuteLayoutEventMethods(
            [...(clickArgs ?? [{
                "exec": "setdatasetfield",
                "args": {
                    "dset": "popupinfo",
                    "fieldname": this.props.popupName,
                    "data": null
                }
            }])], { name: this.props.popupName, title: this.props.title });

    }

    showBackClick() {
        if (appPlatform == "win") {
            if (this.props.whenbackclick) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    }

    async handleSubAppbarBackClick() {
        await ExecuteLayoutEventMethods(this.props?.whenSubAppbarbackclick);
    }

    render() {
        let scaff = new PureJSComponentFactory().scaffoldComponent(this.props.chld);

        return (
            <>
                <AppBar className="factsSubAppbar" position="static" style={this.props?.style}>
                    <Toolbar>
                    {this.props?.whenSubAppbarbackclick?(
                            <IconButton edge="start" color="inherit" onClick={() => this.handleSubAppbarBackClick()} >
                                <Icon>arrow_back</Icon>
                            </IconButton>) :
                            (<></>)}
                        {this.showBackClick() == true ?
                            <IconButton edge="start" color="inherit" onClick={() => this.handleBackClick(this.props?.whenbackclick)} >
                                <Icon>arrow_back</Icon>
                            </IconButton> :
                            <></>}
                        <Typography variant="h6" className="flex-grow" >{this.state.title}</Typography>
                        {scaff}
                    </Toolbar>
                </AppBar>
            </>
        );
    }

}

export default AppBarInnerComponent;