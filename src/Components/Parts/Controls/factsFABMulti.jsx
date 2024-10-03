import React, { Component } from 'react';
import Fab from "@mui/material/Fab";
// import { ExecuteLayoutEventMethods } from '../../../General/commonFunctions';
import PureJSComponentFactory from '../../Pages/Factory/pureJSComponentFactory';
import {  Icon, Zoom } from '@mui/material';

class FactsFABMulti extends Component {

    constructor(props){
        super(props);
         this.state = {
            showSubs: false
        }; 
    }
    ripOffControlSpecificAttributes() {

        const excluded = ["whenclick", "refData", "subs"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));

    }

    async handleClick() {
        this.setState({
            showSubs: !this.state.showSubs
        }
        // , async()=>{ 
        // await ExecuteLayoutEventMethods(this.props.whenclick);
        // }
        ); 
    }
    render() {
        let newProps = this.ripOffControlSpecificAttributes();
        let subScaff = new PureJSComponentFactory().scaffoldComponent(this.props.subs, this.props.itemObject);

        return (
            
              <div className="facts-multiFABDiv factsFABMulti" >
                <Zoom in={this.state.showSubs} >
                    <div className="facts-FABSubs" onClick={()=> this.setState({showSubs: false})}> 
                    {subScaff}
                    </div>
                </Zoom>
                <Fab  {...newProps} children={this.state.showSubs ?  (<Icon>close</Icon>) : newProps.children} 
                        onClick={() => this.handleClick()} />
                </div>
        );
    }
}

export default FactsFABMulti; 