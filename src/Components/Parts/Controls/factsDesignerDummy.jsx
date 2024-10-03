import React, { Component } from "react";
import {  Icon } from "@mui/material";


class FactsDesignerDummy extends Component{
  
    render(){
        return(
            <div {...this.props} style={
                    {
                        backgroundColor: "#ffeb3b", 
                        color: "grey", 
                        padding: "5px",
                        display: "flex", 
                        alignItems : "center"
                } 
            }>
                <Icon style={{pointerEvents:"none"}}>data_object</Icon>
                 {this.props.type}
            </div>
        )
    }
}

export default FactsDesignerDummy; 