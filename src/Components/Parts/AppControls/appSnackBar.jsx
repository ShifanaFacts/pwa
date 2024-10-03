import React, { Component } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/lab/Alert';
import { HideSnackBar } from "../../../General/globalFunctions";
import { ownStore } from "../../../AppOwnState/ownState";

class AppSnackBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackInfo: { open: false }
        };
    }
    componentDidMount() {
        this.mounted = true; 
       this.unsubscribe =  ownStore.subscribe((storeInfo) => {
        if (this.mounted) {
            if (storeInfo.dset === "snackinfo") {
                let dsSnackInfo = ownStore.getState("snackinfo")
                this.setState({
                    snackInfo: dsSnackInfo
                });
            }
            }
        });
    }

    onSnackClose(source) {
        HideSnackBar();
    }

    componentWillUnmount(){
        if(this.unsubscribe) this.unsubscribe(); 
        this.mounted = false; 

    }

    render() {

        return (
            //onClose={this.onSnackClose.bind(this, "snack")} //Removed from Snackbar
            <Snackbar open={this.state.snackInfo?.open} autoHideDuration={this.state.snackInfo?.duration ?? 5000} onClose={this.onSnackClose.bind(this, "snack")} >
                <MuiAlert elevation={6} variant="filled" severity={this.state.snackInfo?.type} onClose={this.onSnackClose.bind(this, "alert")} >
                    {this.state.snackInfo?.message}
                </MuiAlert>
            </Snackbar>
        );
    }
}

export default AppSnackBar;