import PureJSComponentFactory from "../Pages/Factory/pureJSComponentFactory";
import React, { Component } from "react";
import { Grid } from "@mui/material";

class SecondLevelButtons extends Component{
    render(){
        if(!this.props.toolbar) return null; 
        let scaff =   new PureJSComponentFactory().scaffoldComponent(this.props.toolbar) ; 
    
        return( 
            <Grid className="page-toolbar" >
                {scaff}
            </Grid>
            );
    }
}

export default SecondLevelButtons; 