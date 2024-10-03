import { Grid, Dialog } from "@mui/material";
import React, { Component } from "react";
import { hideAppBusy, showAppBusy } from "../AppOwnState";
import { ownStore } from "../AppOwnState/ownState";
import { ExecuteLayoutEventMethods } from "../General/commonFunctions";
import GenericPageComponent from "./Pages/genericPageComponent";
import AppBarInnerComponent from "./Parts/appBarInnerComponent";
import PageHeaderSection from './Parts/pageHeaderSection';

class PopupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupInfo: null
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.popupStateChange(ownStore.getState("popupinfo"));
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                let storeDset = storeInfo.dset;
                if (storeDset === "popupinfo") this.popupStateChange(ownStore.getState("popupinfo"));

            }
        });
    }


    async popupStateChange(dsPopupInfo) { //TODO 05Dec2021: Need to isolate the state of Popup in future to prevent rerendering
        if (dsPopupInfo) {
            // let reduxPopupInfoState = JSON.stringify(dsPopupInfo),
            //   localPopupInfoState = JSON.stringify(this.state.popupInfo);
            // if (reduxPopupInfoState !== localPopupInfoState) {

            // let popupLayoutInfo = pageDs?.popupinfo;
            let plInfo = dsPopupInfo;

            let needPopupEventExecution = [];
            // let currentURLHash = window.location.hash;
            // window.history.pushState({}, '')
            Object.keys(plInfo).forEach((pkey) => {
                let reduxPopupState = JSON.stringify(plInfo[pkey]),
                    localPopupState = this.state.popupInfo && JSON.stringify(this.state.popupInfo[pkey]);
                if (reduxPopupState !== localPopupState) {

                    // currentURLHash = currentURLHash + "/" + pkey;

                    needPopupEventExecution.push(pkey); //* Pushing from the existing dataset is needed as there may be changes in the existing popup too... like layout change.
                }
            });
            // window.location.hash = currentURLHash;
            // ownStore.dispatch(showAppBusy());

            for(const pkey of needPopupEventExecution){
               await ExecuteLayoutEventMethods(plInfo[pkey]?.wheninit, plInfo[pkey]); //Execute init functions of Loaded Popup
            }
            // ownStore.dispatch(hideAppBusy());

            this.setState({
                popupInfo: plInfo
            },
                async () => {
                    for(const pkey of needPopupEventExecution){
                       await ExecuteLayoutEventMethods(plInfo[pkey]?.whenload, plInfo[pkey]); //Execute init functions of Loaded Popup
                     }
                    // window.history.pushState({}, '')
                    // needPopupEventExecution.forEach((pkey) => {
                    //     ExecuteLayoutEventMethods(plInfo[pkey]?.whenload, plInfo[pkey]); //Execute onload functions of Loaded Popup
                    //     // this.popupTimerExecs = plInfo[pkey]?.whentimer; //! need to make it static
                    // });
                });
        }
        // }
    }


    render() {
        return (
            this.state.popupInfo ?
                <div className="popup-wrap">
                    {Object.keys(this.state.popupInfo).map((popupName, index) => {
                        let popup = this.state.popupInfo && this.state.popupInfo[popupName];
                        if (popup) {
                            return ( <SinglePopup popup = {popup}   key={index} popupName = {popupName} />
                              );
                        }
                        else return null;
                    })}
                </div>
                : <></>
        );


    }
}

export default PopupComponent;


const SinglePopup = React.memo(function SingPop(props) {
    let popup = props?.popup; 
    let popupName = props?.popupName; 
    return (<Dialog

        PaperProps={{ className: "animate__animated animate__zoomIn" , style: {overflowY: "none", ...popup?.paperstyle}}}
        fullScreen={popup?.fullscreen ?? true} open={true} >
        {popup?.appbar ?
            (<AppBarInnerComponent {...popup?.appbar} popupName={popupName} />)
            :
            (<></>)
        }
        {popup?.subappbar ?
            (<AppBarInnerComponent {...popup?.subappbar} popupName={popupName} />)
            :
            (<></>)
        }
        <PageHeaderSection pageHeader={popup?.pageheader} />

        <Grid
            container className="page-container" style={popup?.style}>
            <GenericPageComponent pageInfo={popup} />

        </Grid>
    </Dialog>)
});