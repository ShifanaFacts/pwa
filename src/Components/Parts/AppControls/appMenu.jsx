import React, { Component } from "react";
import { MenuItem, Popover } from "@mui/material";
import { HideAppMenu } from "../../../General/globalFunctions";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";
import PureJSComponentFactory from "../../Pages/Factory/pureJSComponentFactory";
import { ownStore } from "../../../AppOwnState/ownState";

class AppMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuInfo: { open: false },
    };
  }

  onMenuClose() {
    HideAppMenu();
    if (this.anchorElement) this.anchorElement.classList.remove("am-parent");
  }

  componentDidMount() {
    this.mounted = true;
    this.unsubscribe = ownStore.subscribe((storeInfo) => {
      if (this.mounted) {
        if (storeInfo.dset === "menuinfo") {
          let dsMenuInfo = ownStore.getState("menuinfo");
          this.setState({
            menuInfo: dsMenuInfo,
          });
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.mounted = false;
  }

  async onMenuClick(whenclick, item) {
    let clickEvent = whenclick;
    if (typeof whenclick == "string") {
      try {
        clickEvent = JSON.parse(whenclick);
      } catch {
        clickEvent = GetControlPropertyFromStoreOrRefData(whenclick);
      }
    }
    await ExecuteLayoutEventMethods(clickEvent, item);
    this.onMenuClose();
  }

  render() {
    if (this.state.menuInfo && this.state.menuInfo?.open) {
      if (this.state.menuInfo?.items?.length) {
        this.anchorElement = document.getElementById(
          this.state.menuInfo?.anchor
        );
        if (this.anchorElement) this.anchorElement.classList.add("am-parent");
      }
      let menuTitle = new PureJSComponentFactory().scaffoldComponent(
        this.state.menuInfo?.title,
        this.state.menuInfo?.refdata
      );
      return this.state.menuInfo?.items?.length > 0 && this.anchorElement ? (
        <Popover
          anchorEl={this.anchorElement}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "end",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          style={{ marginTop: "5px" }}
          keepMounted
          open={this.state.menuInfo?.open}
          onClose={this.onMenuClose.bind(this)}
        >
          {menuTitle}
          {this.state.menuInfo?.items?.map((t, i) => {
            if (!t?.hide) {
              if (this.state.menuInfo?.layout) {
                let menuContent =
                  new PureJSComponentFactory().scaffoldComponent(
                    this.state.menuInfo?.layout,
                    t
                  );
                return (
                  <MenuItem
                    key={i}
                    style={{ padding: "0px" }}
                    onClick={() => this.onMenuClick(t.whenclick, t)}
                  >
                    {menuContent}
                  </MenuItem>
                );
              } else {
                return (
                  <MenuItem
                    key={i}
                    onClick={() => this.onMenuClick(t.whenclick, t)}
                  >
                    {t.text}
                  </MenuItem>
                );
              }
            }
          })}
        </Popover>
      ) : (
        <></>
      );
    }
    return <></>;
  }
}

export default AppMenu;
