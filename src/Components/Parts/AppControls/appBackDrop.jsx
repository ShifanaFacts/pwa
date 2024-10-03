import { Backdrop, CircularProgress } from "@mui/material";
import React, { Component } from "react";

import { ownStore } from "../../../AppOwnState/ownState";

export default class AppBackDrop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAppBusy: false
        }
    }
    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                if (storeInfo.dset === "isAppBusy") {
                    let isAppBusy = ownStore.getState("isAppBusy");
                    this.setState({
                        isAppBusy: isAppBusy
                    });
                }
            }
        });
    }
    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;
    }
    render() {
        return (
            this.state.isAppBusy ?
                (<Backdrop open={this.state.isAppBusy} style={{ zIndex: 9999 }} >
                    <CircularProgress style={{ color: "#3f51b5" }} />
                </Backdrop>) : <></>
        );
    }
}