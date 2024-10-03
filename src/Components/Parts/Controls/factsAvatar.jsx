import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import { GetControlPropertyFromStoreOrRefData, ExecuteLayoutEventMethods } from "../../../General/commonFunctions";

class FactsAvatar extends Component {

    constructor(props) {
        super(props);
        this.avatarImage = GetControlPropertyFromStoreOrRefData(this.props.image, this.props.refData);
        this.avatarText = GetControlPropertyFromStoreOrRefData(this.props.text, this.props.refData);
    }

    ripOffControlSpecificAttributes() {
        const excluded = ["image", "text", "refData"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));

    }

    async handleAvatarClick(e) {
        await ExecuteLayoutEventMethods(this.props.whenclick, { controlid: this.props.id });
    }

    render() {
        let newProps = this.ripOffControlSpecificAttributes();
        return (
            <Avatar className="factsAvatar" src={this.avatarImage} {...newProps} onClick={this.handleAvatarClick.bind(this)}>
                {this.avatarText}
            </Avatar>
        );
    }
}

export default FactsAvatar; 