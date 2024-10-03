import { create } from "jss";
import rtl from "jss-rtl";

import React, { Component } from "react";
import UnAuthorizedComponent from "./Components/unAuthorizedComponent";
import AuthorizedComponent from "./Components/authorizedComponent";
import {
  authServiceInstance,
  applicationTitle,
  appTheme,
  objVoiceRecorder,
  whenAppInit,
  appTimer,
  apiRoot,
  authMethode,
  stylefile,
} from "./General/globals";
import {
  Backdrop,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  HashRouter as Router,
  Switch as RouteSwitch,
  Route,
  useLocation,
} from "react-router-dom";
import { authLogout, authLogin, showAppBusy, hideAppBusy } from "./AppOwnState";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "./General/commonFunctions";
import "./Styles/animate.min.css";
import "./Styles/basic.css";
import "./Styles/responsive.css";
import {
  GPSLocation,
  DownloadFileFromState,
  ShowSnackBar,
} from "./General/globalFunctions";
import AppDialog from "./Components/Parts/AppControls/appDialog";
import AppSnackBar from "./Components/Parts/AppControls/appSnackBar";
import AppMenu from "./Components/Parts/AppControls/appMenu";
import appNotification from "./Components/Parts/AppControls/appNotification";
import { ownStore } from "./AppOwnState/ownState";
import AppBackDrop from "./Components/Parts/AppControls/appBackDrop";
import { StylesProvider, jssPreset } from "@mui/styles";
import queryString from "query-string";
import Helmet from 'react-helmet'

class App extends Component {
  constructor() {
    super();

    this.state = {
      isPageLoading: true,
      isAuthenticated: false,
      pageInfo: null,
      uiDirection: "ltr",
      authid: "",
      authemail: "",
    };

    GPSLocation();

    this.unsubscribe = ownStore.subscribe((storeInfo) => {
      let storeDset = storeInfo.dset;
      if (storeDset === "login") {
        let loginDS = ownStore.getState("login");
        if (loginDS?.isAuthenticated !== this.state.isAuthenticated) {
          appTimer.isAuthenticated = loginDS?.isAuthenticated;

          this.setState({
            isAuthenticated: loginDS?.isAuthenticated,
          });
        }
      }

      if (storeDset === "_userinfo")
        this.userInfoStateChange(ownStore.getState("_userinfo"));

      if (storeDset === "pageinfo")
        this.pageStateChange(ownStore.getState("pageinfo"));
      if (storeDset === "notifyinfo")
        appNotification(ownStore.getState("notifyinfo"));
      if (storeDset === "mediainfo") {
        let mediaInfo = ownStore.getState("mediainfo");
        mediaInfo && objVoiceRecorder.doAction(mediaInfo);
      }
      if (storeDset === "downloadinfo") {
        let downloadInfo = ownStore.getState("downloadinfo");
        if (downloadInfo?.open) DownloadFileFromState(downloadInfo); //*Download base64 as file if any
      }

      if (storeDset === "dsAppTheme") {
        let dsAppTheme = ownStore.getState("dsAppTheme");
        if(dsAppTheme)
        {
          appTheme.palette.mode = dsAppTheme?.mode ?? "light";
          appTheme.palette.primary.main = dsAppTheme?.primary_color?? "#0b3eaf";
          appTheme.palette.secondary.main = dsAppTheme?.secondary_color?? "#f2f2f7";

          this.applyAppOptions("ltr");
          this.setState({});
        }
      }

    });

    this.applyAppOptions("ltr");
  }

  async applyAppOptions(direction) {
    if (appTheme) {
      appTheme.direction = direction;
      this.theme = createTheme(appTheme);
      this.appJSS = create({ plugins: [...jssPreset().plugins, rtl()] });
      document.querySelector("body").setAttribute("dir", direction);
      if (appTheme?.header)
        document
          .querySelector("meta[name=theme-color]")
          .setAttribute("content", appTheme?.header);
    }
  }

  async componentDidMount() {
    await ExecuteLayoutEventMethods(whenAppInit); //*AppInit events from Initjson

    let authOK = await authServiceInstance.verifyLogin();

    ownStore.dispatch(authOK?.status ? authLogin() : authLogout()); //Redux
    const queryStringParams = queryString.parse(window.location.search);

    if (
      this.state.queryStringParams != "" &&
      this.state.queryStringParams != "undefined"
    ) {
      this.setState({
        authid: queryStringParams.authtoken,
        authemail: queryStringParams.email,
      });

      if (this.state.authemail != "" && this.state.authemail !== undefined) {
        this.doSignInSSO();
      }
    }

    this.setState({
      isPageLoading: false,
    });
    appTimer.runTimer();

    if (stylefile !== "") {
      this._loadCSS();
    }
  }

  async doSignInSSO() {
    try {
      // document.location.hash = '/yes';
      // this.props.history.replace({ pathname: `/home`})
      window.history.pushState(null, "Home", "/");
      // window.history.pushState({}, '')
      ownStore.dispatch(showAppBusy());
      await authServiceInstance.SSOlogin(
        this.state.authemail,
        this.state.authid
      );
      let authOK = await authServiceInstance.verifyLogin();
      if (authOK?.status) {
        if (authOK?.doNext) {
          ownStore.dispatch(hideAppBusy());
          try {
            let authEvents = JSON.parse(authOK.doNext);
            await ExecuteLayoutEventMethods(authEvents);
          } catch {}
          return;
        }
        authServiceInstance.continueLogin();
        return;
      }
    } catch (ex) {
      console.error(ex);
    }
    ownStore.dispatch(hideAppBusy()); //Hide loader if the authentication failed with an errorx

    ShowSnackBar("error", "Login Failed!");
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.timeInterval);
  }

  async userInfoStateChange(dsUserInfo) {
    if (dsUserInfo.uidirection !== this.state.uiDirection) {
      await this.applyAppOptions(dsUserInfo.uidirection ?? "ltr");

      this.setState({
        uiDirection: dsUserInfo.uidirection,
      });
    }
  }
  async pageStateChange(dsPageInfo) {
    let layoutInfo = dsPageInfo;
    let pInfo = layoutInfo;
    await ExecuteLayoutEventMethods(pInfo?.wheninit, pInfo); //Execute init functions of Loaded Page
    document.title = `${applicationTitle} ${
      layoutInfo?.title
        ? " - " + GetControlPropertyFromStoreOrRefData(layoutInfo?.title)
        : ""
    }`;
    this.setState(
      {
        pageInfo: pInfo,
      },
      async () => {
        await ExecuteLayoutEventMethods(pInfo?.whenload, pInfo); //Execute init functions of Loaded Page
        appTimer.pageTimerExecs = pInfo?.whentimer;
      }
    );
  }

  _loadCSS() {
    require("./Styles/" + stylefile);
  }

  _getComponentToStart(routerProps) {
    // let params = queryString.parse(this.props.location.search)
    // const query = new URLSearchParams(this.props.location.search);
    //const token = query.get('token');

    //const search = useLocation().search;
    // const id = new URLSearchParams(search).get("id");

    if (!this.state.isAuthenticated && authMethode === "cookie") {
      window.location = apiRoot;
      return <></>;
    }
    // alert("Cookie Auth Missing")

    return this.state.isAuthenticated ? (
      <AuthorizedComponent pageInfo={this.state.pageInfo} {...routerProps} />
    ) : (
      <UnAuthorizedComponent {...routerProps} />
    );
  }

  render() {
    if (this.state.isPageLoading)
      return (
        <Backdrop open={this.state.isPageLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
      let style = GetControlPropertyFromStoreOrRefData("[customCSS]");

    return (
    <>
      {(style && style.length>0) &&
    <Helmet>
      <style id="globalstyle">{style}
      </style>  
    </Helmet>}
      <StylesProvider jss={this.appJSS}>
        <ThemeProvider theme={this.theme}>
          <AppBackDrop />
          <Router>
            <RouteSwitch>
              <Route
                exact
                path="/"
                render={() => this._getComponentToStart(null)}
              ></Route>
              <Route
                path="/:permalink/:id"
                render={(routerProps) => this._getComponentToStart(routerProps)}
              ></Route>
              <Route
                path="/:permalink"
                render={(routerProps) => this._getComponentToStart(routerProps)}
              ></Route>
              <Route
                path="/:permalink?authtoken=:authtoken&email=:email"
                render={(routerProps) => this._getComponentToStart(routerProps)}
              ></Route>
            </RouteSwitch>
          </Router>
          <AppSnackBar />
          <AppDialog />
          <AppMenu />
        </ThemeProvider>
      </StylesProvider>
      </>
    );
  }
}

export default App;
