import React, { Component } from "react";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";
// import store from "../../../AppRedux/store";
import { GetControlPropertyFromStoreOrRefData, ExecuteLayoutEventMethods, getProcessedDynamic } from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsIconButton extends Component {
    constructor(props) {
        super(props);
        let _propsRedux = null;
        let _badgeContent = null;
        if (props.appendprops) _propsRedux = getProcessedDynamic(props.appendprops, props.refData);
        if (props.badge) _badgeContent = GetControlPropertyFromStoreOrRefData(props.badge?.content, props.refData);
        this.state = {
            propsRedux: _propsRedux,
            badgeContent: _badgeContent
        };
        this.controlRef = React.createRef();

    }
    ripOffControlSpecificAttributes() {

        const excluded = ["whenclick", "refData", "badge", "appendprops"];
        return (
            Object.keys(this.props)
                .filter((t) => !excluded.includes(t))
                .reduce((obj, key) => {
                    obj[key] = this.props[key];
                    return obj;
                }, {}));

    }

    componentDidMount() {
        this.unmount = true;
        if (this.props.appendprops || this.props.badge) {
            this.unsubscribe = ownStore.subscribe(() => {
                if (this.unmount) {

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
        this.unmount = false;
        if (this.unsubscribe) this.unsubscribe();
    }

    async handleButtonClick(e) {
        e.preventDefault(); 

        await ExecuteLayoutEventMethods(this.props.whenclick, { ...this.props.refData, controlid: this.props.id });
    }

    getCurrentTarget() {
        return this.controlRef;
    }
 

    render() {
        let newProps = this.ripOffControlSpecificAttributes();

        return (
            <IconButton  {...newProps} className={`${newProps.className} factsIconButton`}  {...this.state.propsRedux} onClick={this.handleButtonClick.bind(this)}>
                {this.props.badge ?
                    <Badge className="factsIconBadge" badgeContent={this.state.badgeContent} {...this.props.badge?.props} >
                        <Icon className="factsIcon">{this.props.children}</Icon>
                    </Badge>
                    :
                    <Icon style={{ fontSize: this.state.propsRedux?.style?.fontSize || newProps?.style?.fontSize }}>{this.props.children}</Icon>
                }
            </IconButton>
        );
    }

}

export default FactsIconButton; 