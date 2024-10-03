import React, { Component } from "react";
import QrReader from 'react-qr-reader'
import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";


class FactsQRCode extends Component {
    constructor(props) {
        super(props);
        window.qrScanNow = this.handleScan.bind(this); 
    }
 
    async handleScan(data) {
        if (data) {
            await ExecuteLayoutEventMethods(this.props.whenscan, data);
        }
    }
    async handleError(err) {
        await ExecuteLayoutEventMethods(this.props.whenerror, err);
    }


    ripOffControlSpecificAttributes() {
        const excluded = ["resolveprops", "refData", "whenscan", "whenerror"];
        return (
            Object.keys(this.props)
                .filter((t) => !excluded.includes(t))
                .reduce((obj, key) => {
                    obj[key] = this.props[key];
                    return obj;
                }, {}));

    }

    render() {
        let newProps = this.ripOffControlSpecificAttributes();

        return (<QrReader
            className="factsQRCode"
            delay={1000}
    
            onError={(data)=> this.handleError(data)}
            onScan={(err) => this.handleScan(err)}
            {...newProps}
        />);
    }
}

export default FactsQRCode; 