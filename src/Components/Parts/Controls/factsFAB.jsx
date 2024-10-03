import React, { Component } from 'react';
import Fab from "@mui/material/Fab";
import { ExecuteLayoutEventMethods } from '../../../General/commonFunctions';

class FactsFAB extends Component {


    ripOffControlSpecificAttributes() {

        const excluded = ["whenclick", "refData"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));

    }

    async handleClick() {
        await ExecuteLayoutEventMethods(this.props.whenclick);
    }
    render() {

        let newProps = this.ripOffControlSpecificAttributes();

        return (
            <Fab className="factsFAB" {...newProps} onClick={() => this.handleClick()} />
        ); 
        
    }
}

export default FactsFAB; 