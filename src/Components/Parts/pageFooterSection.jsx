import React, { Component } from "react";
import { BottomNavigation, BottomNavigationAction, Icon } from "@mui/material";
import { appTheme } from "../../General/globals";
import { ExecuteLayoutEventMethods } from "../../General/commonFunctions";

class PageFooterSection extends Component {
    constructor(props) {
        super(props);
        this.primaryColor = appTheme?.palette?.primary?.main;
    }

    async menuItemClick(menuItem) {
        window.history.pushState({}, '', '#/' + (menuItem?.permalink ?? ""));
        await ExecuteLayoutEventMethods([{
            "exec" : "setdataset", 
            "args" : {
                "dset" : "pagemenuinfo",
                "data" :menuItem
            }
        }]); 
        // window.location.hash = "#" + (menuItem?.permalink ?? "");
        await ExecuteLayoutEventMethods(menuItem?.action);
    }

    render() {

        let currentOptions = this.props.userMenu?.filter(t => t.module === "BNB");

        return (
            currentOptions?.length > 0 && this.props.pageFooter ?
                <div >
                    <BottomNavigation style={{ backgroundColor: this.props.pageFooter?.bgcolor ?? this.primaryColor }} >
                        {currentOptions?.map((t, index) => {
                            return (
                                <BottomNavigationAction key={index} showLabel={true} label={t.caption} value="recents"
                                    style={{ color: this.props.pageFooter?.textcolor ?? "white" }}
                                    icon={<Icon style={{ color: this.props.pageFooter?.iconcolor ?? "white" }}>{t.icon}</Icon>}
                                    onClick={() => this.menuItemClick(t)}
                                />
                            );
                        })}

                    </BottomNavigation>
                </div> : <></>

        );
    }
}

export default PageFooterSection; 