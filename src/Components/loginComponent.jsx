import React, { Component } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import {
  Button,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Icon,
  Typography,
} from "@mui/material";
import {
  authServiceInstance,
  applicationTitle,
  loginImage,
  loginTitle,
  loginDivStyle,
  loginTextStyle,
  appTitles,
  loginImageStyle,
  loginBoxStyle,
  setGlobalDrawerWidth,
} from "../General/globals";
import { offlineLayoutInfo } from "../General/globals";
// import store from "../AppRedux/store";
import { showAppBusy, hideAppBusy } from "../AppOwnState";
import { ShowSnackBar } from "../General/globalFunctions";
import { ownStore } from "../AppOwnState/ownState";
import { ExecuteLayoutEventMethods } from "../General/commonFunctions";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import PureJSComponentFactory from "./Pages/Factory/pureJSComponentFactory";

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: "",
      password: "",
      rememberMe: false,
      pwdPlainText: false,
    };
    document.title = applicationTitle;
    setGlobalDrawerWidth(0);
    this.loginFooter = new PureJSComponentFactory().scaffoldComponent(
      offlineLayoutInfo?.loginfooter
    );
    this.loginSplitImage = new PureJSComponentFactory().scaffoldComponent(
      offlineLayoutInfo?.loginsplitimage
    );
  }

  handleInputChange(e) {
    let stateValue = e.target.value;
    if (e.target.type === "checkbox") {
      stateValue = e.target.checked;
    }
    this.setState({
      [e.target.id]: stateValue,
    });
    }
    
    // async forgotPassword(event) {
    //     event.preventDefault();
    //     alert("sghbdcnlkcsdvbsdjvbsdkvj")
        
    //      await ExecuteLayoutEventMethods(
    //        [
    //          {
    //            exec: "filldataset",
    //            args: {
    //              proc: "PWA.LoadLayout",
    //              dset: "popupinfo",
    //              column: "layoutinfo",
                 
    //              args: {
    //                doctype: "popup",
    //                docno: "forgot-password",
    //              },
    //            },
    //          },
    //        ],
    //        null
    //      );
    // }

  async doSignIn(e) {
    try {
      e.preventDefault();
      ownStore.dispatch(showAppBusy());
      await authServiceInstance.login(
        this.state.loginName,
        this.state.password,
        this.state.rememberMe
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

  render() {
    return (
      <form onSubmit={this.doSignIn.bind(this)}>
        <Card className="login-card" variant="outlined" style={loginBoxStyle}>
          <CardContent className="loginCard">
            <Grid container spacing={3} className="loginCardGrid">
              <Grid item xs={12} className="login-head" style={loginDivStyle}>
                {loginImage && (
                  <img
                    style={{ height: "100px", ...loginImageStyle }}
                    src={loginImage}
                    alt="Logo"
                    className="logoImageClass"
                  />
                )}
                {loginTitle && <h2 style={loginTextStyle}>{loginTitle}</h2>}
              </Grid>
              {/* <Grid className="login-heading">
                <h4>Login into your account</h4>
                <p class="mb-10">
                  Use your credentials to access your account.
                </p>
              </Grid> */}
              <Grid item xs={12} className="loginNameGrid">
                <TextField
                  id="loginName"
                  className="loginNameTextfiled"
                  label={appTitles?.loginname ?? "Username"}
                  variant="outlined"
                  size="small"
                  autoComplete="off"
                  onChange={this.handleInputChange.bind(this)}
                  InputProps={{
                    style: { backgroundColor: "white", borderRadius: "5px" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  value={this.state.loginName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} className="passwordGrid">
                <TextField
                  id="password"
                  className="paswwordTextfield"
                  label={appTitles?.password ?? "Password"}
                  variant="outlined"
                  size="small"
                  autoComplete="off"
                  onChange={this.handleInputChange.bind(this)}
                  value={this.state.password}
                  type={this.state.pwdPlainText ? "text" : "password"}
                  fullWidth
                  InputProps={{
                    style: { backgroundColor: "white", borderRadius: "5px" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() =>
                            this.setState({
                              pwdPlainText: !this.state.pwdPlainText,
                            })
                          }
                        >
                          <Icon>
                            {this.state.pwdPlainText
                              ? "visibility_off"
                              : "visibility"}
                          </Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={6} className="rememberMeGrid">
                <FormControlLabel
                  control={
                    <Switch
                      id="rememberMe"
                      className="rememberMeSwitch"
                      checked={this.state.rememberMe}
                      onChange={this.handleInputChange.bind(this)}
                    />
                  }
                  label={
                    <Typography
                      style={{ fontSize: "0.8rem", fontWeight: "bold" }}
                      className="rememberMeTypo"
                    >
                      {appTitles?.rememberme ?? "Remember Me"}
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={6} className="signinGrid">
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  color="primary"
                  className="signinButtonClass"
                  fullWidth
                >
                  {appTitles?.loginbutton ?? "Sign In"}
                </Button>
              </Grid>
              {/* <Grid item xs={12} className="forgotPassClass">
                <a href="" onClick={this.forgotPassword}>
                  Forgot password?
                </a>
              </Grid> */}
              {this.loginFooter && (
                <Grid item xs={12} className="loginFooterClass">
                  {this.loginFooter}
                </Grid>
              )}
              {/* <Grid item xs={12} className="loginFooterClass">
                {this.loginFooter}
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>
      </form>
    );
  }
}

export default LoginComponent;
