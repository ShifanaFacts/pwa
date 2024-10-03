import React, { Component } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { HideDialog } from "../../../General/globalFunctions";
import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";
import PureJSComponentFactory from "../../Pages/Factory/pureJSComponentFactory";
import { ownStore } from "../../../AppOwnState/ownState";

class AppDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogInfo: { open: false }
        };
    }
    componentDidMount() {
        this.mounted = true; 
       this.unsubscribe =  ownStore.subscribe((storeInfo) => {
        if (this.mounted) {
            if (storeInfo.dset === "dialoginfo") {
                let dsDialogInfo = ownStore.getState("dialoginfo")
                this.setState({
                    dialogInfo: dsDialogInfo
                });
            }
            }
        });
    }

    async firstButtonClick() {
        HideDialog();

        if (this.state.dialogInfo?.btn1?.props?.whenclick)
            await ExecuteLayoutEventMethods(this.state.dialogInfo?.btn1?.props?.whenclick);
    }
    async secondButtonClick() {
        HideDialog();

        if (this.state.dialogInfo?.btn2?.props?.whenclick)
            await ExecuteLayoutEventMethods(this.state.dialogInfo?.btn2?.props?.whenclick);

    }
    onDialogClose() {
        HideDialog();
    }
    render() {

        let scaff = this.state.dialogInfo?.description; 
        if( this.state.dialogInfo?.content) scaff = new PureJSComponentFactory().scaffoldComponent( this.state.dialogInfo?.content, "", (Math.random() * 10000).toFixed());
        return (

            <Dialog open={this.state.dialogInfo?.open} onClose={this.onDialogClose.bind(this)}
                style={{ zIndex: 10000 }} >
                <DialogTitle id="alert-dialog-title">{this.state.dialogInfo?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {scaff}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {this.state.dialogInfo?.btn1 ?
                        <Button onClick={this.firstButtonClick.bind(this)} color="primary"   {...this.state.dialogInfo?.btn1?.props}>
                            {this.state.dialogInfo?.btn1?.chld}
                        </Button>
                        : null}
                    {this.state.dialogInfo?.btn2 ?
                        <Button onClick={this.secondButtonClick.bind(this)} color="primary" autoFocus  {...this.state.dialogInfo?.btn2?.props}>
                            {this.state.dialogInfo?.btn2?.chld}
                        </Button>
                        : null
                    }
                </DialogActions>
            </Dialog>
        );
    }
}

export default AppDialog; 