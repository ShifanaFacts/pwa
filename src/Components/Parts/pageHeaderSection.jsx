import PureJSComponentFactory from "../Pages/Factory/pureJSComponentFactory";
import React, { Component } from "react";
import { Grid } from "@mui/material";

class PageHeaderSection extends Component{
    render(){
        if(!this.props.pageHeader) return null; 
        let scaff =   new PureJSComponentFactory().scaffoldComponent(this.props.pageHeader) ; 
    
        return( 
            <Grid className="page-header" >
                {scaff}
            </Grid>
            );
    }
}

export default PageHeaderSection; 