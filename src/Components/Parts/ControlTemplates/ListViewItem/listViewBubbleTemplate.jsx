import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";


class ListViewBubbleTemplate extends Component {

    render() {
        return (<div className="cm-bubble"   >

            <Avatar alt={this.props.itemObject?.avatar}
                style={{ marginRight: "10px", float: "left", "backgroundColor": "#4CAF50", "color": "white" }}
                src={this.props.itemObject?.avatar} />

            <span>
                <div style={{ fontWeight: "bold" }}>{this.props.itemObject.head}</div>
                <div>{this.props.itemObject.title}</div>
                <div style={{ fontSize: "10px" }}>{this.props.itemObject.foot}</div>
            </span>

        </div>);
    }


}

export default ListViewBubbleTemplate; 