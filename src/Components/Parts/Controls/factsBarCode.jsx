import React, { Component } from "react";
 import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";


class FactsBarCode extends Component {
 

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

        return (<BarcodeScannerComponent
            className="factsBarCode"
            width="100%" height="100%"
            onUpdate={(err, result)=> {
                if(result){
                    this.handleScan(result.text); 
                    
                }
                else{
                    this.handleError(err)
                }
            } }
            {...newProps}
        />);
    }
}

export default FactsBarCode; 