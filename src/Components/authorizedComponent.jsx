import React, { Component } from "react";
import AppBarComponent from "./Parts/appBarComponent";
import StorageService from "../Services/storageService";
import {
  authMethode,
  authServiceInstance,
  userDetailsStorageKey,
  userMenuStorageKey,
  whenAppLoad,
  appDrawerWidth,
  setGlobalDrawerWidth,
  appTheme,
  appPlatform,
  setGlobalTimeZone,
  themeload,
  appThemeClass
} from "../General/globals";
import GenericPageComponent from "./Pages/genericPageComponent";
import { AppBar, Grid, Drawer } from "@mui/material";
import AppBarInnerComponent from "./Parts/appBarInnerComponent";
// import store from "../AppRedux/store";
import {
  ExecuteLayoutEventMethods,
  SetCreateDataSet,
  _getFuncValue,
} from "../General/commonFunctions";
import PageHeaderSection from "./Parts/pageHeaderSection";
import PageFooterSection from "./Parts/pageFooterSection";
import PopupComponent from "./popupComponent";
import { styled, useTheme } from "@mui/material/styles";
let drawerVariantValue;
class AuthorizedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMenu: null,
    };
    // if (appPlatform == "win") {
    //   drawerVariantValue = "persistent";
    // } else {
    //   drawerVariantValue = "temporary";
    // }
    
    if(appThemeClass){
      drawerVariantValue = (_getFuncValue("screensize") === "lg" ? "persistent" : "temporary");
    }
    else {
      drawerVariantValue = "temporary";
    }
  }

  async getDetailsFromServer() {
    let _userInfo = await this.getCurrentUserDetails();
    let _userMenu = await this.loadUserSpecificMenu(_userInfo.userrole);
    return {
      _userInfo,
      _userMenu,
    };
  }

  getDetailsFromLocal() {
    let _userInfo = new StorageService().getJsonValue(userDetailsStorageKey);
    let _userMenu = new StorageService().getJsonValue(userMenuStorageKey);

    return {
      _userInfo,
      _userMenu,
    };
  }

  setContentWidth(passedState) {
    if (drawerVariantValue == "persistent") {
      if (passedState == true && appDrawerWidth != 0) {
        setGlobalDrawerWidth(0);
      } else {
        if (passedState === true) {
          setGlobalDrawerWidth(240);
        } else {
          setGlobalDrawerWidth(0);
        }
      }
      var elems = document.getElementsByClassName(appTheme.appbarClass);
      let sWidth = `calc(100% - ${appDrawerWidth}px`;
      for (let elem of elems) {
        elem.style.width = sWidth;
        elem.style.marginLeft = `${appDrawerWidth}px`;
      }
    }
    if (appDrawerWidth == 0) {
      localStorage.setItem("wasDrawerVisible", false);
    } else {
      localStorage.setItem("wasDrawerVisible", true);
    }
  }

  async initialSetup() {
    let { _userInfo, _userMenu } =
      authMethode === "cookie"
        ? await this.getDetailsFromServer()
        : await this.getDetailsFromLocal();

    _userMenu =
      _userMenu &&
      _userMenu?.map &&
      _userMenu?.map((t) => {
        let actionObj = JSON.parse(t.action);
        t.action = actionObj;
        return t;
      });

      let passedTimeZone="";
    if (_userInfo.timezone == null || _userInfo.timezone == "" || _userInfo.timezone == "undefined") {
      passedTimeZone = "Asia/Dubai";
    }
    else {
      passedTimeZone = _userInfo.timezone;
    }
      if(_userInfo.usertheme !=null||_userInfo.usertheme!="") {
        await ExecuteLayoutEventMethods("[dsInitThemeLoad]");
      }

      setGlobalTimeZone(passedTimeZone);

    if (!_userInfo || !_userMenu) {
      ExecuteLayoutEventMethods([{ exec: "logout" }]);
      return;
    }

    // store.dispatch(storeUser(userInfo)); //Redux
    SetCreateDataSet({ dset: "_userinfo" }, _userInfo); //Redux
    SetCreateDataSet({ dset: "_usermenu" }, _userMenu); //Redux
    this.setState({
      userMenu: _userMenu,
    });
    await ExecuteLayoutEventMethods(whenAppLoad, null, null, true); //Appload from Initjson
  }

  async componentDidMount() {
    await this.initialSetup();
    this.handleRouting();
    // ownStore.dispatch(hideAppBusy());
  }

  async getCurrentUserDetails() {
    let userDetails = await authServiceInstance.loadUserDetails();
    if (userDetails && userDetails.length > 0) {
      return userDetails[0];
    }
    return null;
  }
  async loadUserSpecificMenu(_userrole) {
    let _userMenu = await authServiceInstance.loadUserMenu({
      userrole: _userrole,
    });
    new StorageService().setJsonValue(userMenuStorageKey, _userMenu);
    return _userMenu;
  }

  async handleRouting() {
    let docNoFromRoute = this.props?.match?.params["permalink"];
    let pageToShow = this.state.userMenu?.filter(
      (t) => docNoFromRoute === t.permalink
    );
    if (pageToShow?.length <= 0) {
      pageToShow = this.state.userMenu?.filter(
        (t) => t.homepage && t.homepage.toLowerCase() === "true"
      );
    }
    if (pageToShow?.length > 0) {
      // window.location.hash = "#" + pageToShow[0]?.permalink;
      await ExecuteLayoutEventMethods(
        [
          {
            exec: "setdataset",
            args: {
              dset: "pagemenuinfo",
              data: pageToShow[0],
            },
          },
        ],
        null,
        null,
        true
      );
      await ExecuteLayoutEventMethods(pageToShow[0]?.action, null, null, true);
    }
  }

  render() {
    if (!this.state.userMenu) return <></>;
    return (
      // <ThemeProvider theme={this.theme} >
      <>
        <div className="main-wrap">
          {this.props.pageInfo && (
            <AppBarComponent
              pageInfo={this.props.pageInfo}
              drawerVariant={{
                drawerVariantValue,
              }} 
              {...this.props.pageInfo?.appbar}
              userMenu={this.state.userMenu}
              setWidthFunc={this.setContentWidth}
              /*executeMenuRouting={this.executeMenuRouting.bind(this)} />*/
            ></AppBarComponent>
          )}
          <div
            className={`page-wrap ${appTheme.appbarClass}`}
            style={this.props.pageInfo?.style}
          >
            {this.props.pageInfo?.subappbar ? (
              <AppBarInnerComponent
                {...this.props.pageInfo.subappbar}
                pageInfo={this.props.pageInfo}
              />
            ) : (
              <></>
            )}

            <PageHeaderSection pageHeader={this.props.pageInfo?.pageheader} />

            <Grid container className="page-container">
              <GenericPageComponent pageInfo={this.props.pageInfo} />
            </Grid>
          </div>
          <PageFooterSection
            pageFooter={this.props.pageInfo?.pagefooter}
            userMenu={this.state.userMenu}
          />
        </div>
        <PopupComponent />
      </>
      // </ThemeProvider>
    );
  }
}

export default AuthorizedComponent;
