import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import LoginComponent from "./loginComponent";
// import Grid from "@mui/material/Grid";
import AppUpdate from "../AppUpdate";
import PureJSComponentFactory from "./Pages/Factory/pureJSComponentFactory";
import { offlineLayoutInfo } from "../General/globals";
import PopupComponent from "./popupComponent";

class unAuthorizedComponent extends Component {
  constructor(props) {
    super(props);

    this.pageFooter = new PureJSComponentFactory().scaffoldComponent(
      offlineLayoutInfo?.mainfooter
    );
    this.loginFooter=null
    this.loginFooter = new PureJSComponentFactory().scaffoldComponent(
      offlineLayoutInfo?.loginfooter
    );
    this.loginSplitImage = new PureJSComponentFactory().scaffoldComponent(
      offlineLayoutInfo?.loginsplitimage
    );

    

    // localStorage.getItem("")
    //ExecuteLayoutEventMethods(whenAppInit); //AppInit events from Initjson
  }
  render() {
    if (this.loginSplitImage) {
      return (
        <>
          <div className="login-container">
            {/* <div className="update-container"
                     style= {{ position: "absolute", top: "0", right: "0", height: "100vh" }}>
                 
               </div> */}
            <div container className="login-grid">
              <div class="left">
                <AppUpdate />
                <LoginComponent />
              </div>
              <div class="right">{this.loginSplitImage}</div>
              {/* <div class="right">{this.pageFooter}</div> */}
            </div>
          </div>
          <PopupComponent />
        </>
      );
    } else {
      return (
        <>
          <div className="login-container">
            <div className="update-container">
              <AppUpdate />
            </div>
            <Grid container className="login-grid">
              <Grid item lg={4} sm={2}></Grid>
              <Grid item lg={4} sm={8}>
                <LoginComponent />
              </Grid>
              <Grid item lg={4} sm={2}></Grid>
            </Grid>

            {this.pageFooter}
          </div>
          <PopupComponent />
        </>
      );
    }
    
  }
}
export default unAuthorizedComponent;
