import React, { Component } from "react";
import Button from "@mui/material/Button";
// import store from "../../../AppRedux/store";
import {  ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData, getProcessedDynamic } from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";
import { getUniqueID } from "../../../General/globals";
import { Badge } from "@mui/material";


class FactsButton extends Component {
    constructor(props) {
        super(props);
        let _propsRedux = null;
        let _badgeContent = null;

        if (props.appendprops) _propsRedux = getProcessedDynamic(props.appendprops, this.props.refData);
        if (props.badge) _badgeContent = GetControlPropertyFromStoreOrRefData(props.badge?.content, props.refData);

        this.state = {
            propsRedux: _propsRedux,
            badgeContent: _badgeContent
        }
        this.btnID = this.props.id ?? "btn" + getUniqueID();
    }


    ripOffControlSpecificAttributes() {

        const excluded = ["whenclick", "appendprops",  "refData"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));

    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.appendprops) {
            this.unsubscribe = ownStore.subscribe(() => {
                if (this.mounted) {
                    let newState = getProcessedDynamic(this.props.appendprops, this.props.refData);
                    if (JSON.stringify(this.state.propsRedux) !== JSON.stringify(newState)) {

                        this.setState({
                            propsRedux: newState
                        });
                    }

                    
                    let _reduxBadgeContent = GetControlPropertyFromStoreOrRefData(this.props.badge?.content, this.props.refData);
                    if (this.state.badgeContent !== _reduxBadgeContent) {
                        this.setState({
                            badgeContent: _reduxBadgeContent
                        });
                    }
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;
    }

    async handleButtonClick() {
        await ExecuteLayoutEventMethods(this.props.whenclick, { ...this.props.refData, controlid: this.btnID });

    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (JSON.stringify(this.state) === JSON.stringify(nextState)) {
    //         return false;

    //     } else {
    //         return true;
    //     }
    // }

    render() {
        let newProps = this.ripOffControlSpecificAttributes();
        return (
            <Button id={this.btnID} type="submit" {...newProps} className={`${newProps.className} factsButton`} {...this.state.propsRedux} onClick={this.handleButtonClick.bind(this)}>
              <Badge badgeContent={this.state.badgeContent} {...this.props.badge?.props} >
                        {this.props.children}
                    </Badge>    
                {/* {this.props.children} */}
            </Button>
        );
    }
}

export default FactsButton; 