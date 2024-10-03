import React, { Component } from "react";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { Checkbox, FormControlLabel, Icon } from "@mui/material";
import { ownStore } from "../../../AppOwnState/ownState";
 
class FactsCheckbox extends Component {
    constructor(props) {
        super(props);
        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

        let checkValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
            this.rowIndex + "." + props.bind + "]", props.refData);
        let checkVal = (checkValueFromState ?? false); 
        if(typeof parseInt(checkVal) === "number" ) checkVal = (checkVal != 0); 
        this.state = {
            checkValue: checkVal
        }
        this.finalValue = checkVal; 

    }

    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                if(![storeInfo.dset, "this"].includes(this.props.dset)) return; 
                let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex + "." + this.props.bind + "]", this.props.refData);
                let checkVal = (newState ?? false); 
                if(typeof parseInt(checkVal) === "number" ) checkVal = (checkVal != 0); 
                if (this.finalValue !== checkVal) {
                    this.finalValue = checkVal;
                    this.setState({
                        checkValue: checkVal
                    });
                }
            }
        });

    }



    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }


    async saveCurrentTextToDataset() {
        this.finalValue = this.state.checkValue;
        if (this.rowIndex !== "") {
            let rowData = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex + "]", this.props.refData);

            await ExecuteLayoutEventMethods([
                {
                    exec: "mergedatasetarray",
                    args: {
                        dset: this.props.dset,
                        index: parseInt(this.rowIndex),
                        data: {
                            ...rowData,
                            [this.props.bind]: this.state.checkValue
                        }
                    }
                }]);
        }
        else {
            await ExecuteLayoutEventMethods([

                {
                    exec: "setdatasetfield",
                    args: {
                        dset: this.props.dset,
                        fieldname: this.props.bind,
                        data: this.state.checkValue
                    }
                }
            ]);
        }
    }
    async runCustomOnChangeEvents() {
        await this.saveCurrentTextToDataset();
        if (this.props.whenchange) await ExecuteLayoutEventMethods(this.props.whenchange, this.props.refData);

        if (this.state.checkValue === true) {
            if (this.props.whencheck) await ExecuteLayoutEventMethods(this.props.whencheck, this.props.refData);
        }
        else {
            if (this.props.whenuncheck) await ExecuteLayoutEventMethods(this.props.whenuncheck, this.props.refData);
        }

    }
    async handleOnChange(e) {
        this.finalValue = e.target.checked;
        this.setState({
            checkValue: e.target.checked
        }, () => {

            this.runCustomOnChangeEvents();
        });
    }


    ripOffControlSpecificAttributes() {
        const excluded = ["resolveprops", "refData", "rowindex", "label", "labelProps"];
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
            console.log(`Check value ${this.state.checkValue}`); 
        return (
            <FormControlLabel
                control={
                    <Checkbox className="factsCheckbox"
                        size="small" 
                        {...newProps} 
                        checked={this.state.checkValue}
                        onChange={(e) => this.handleOnChange(e)}
                    />
                }
                style={{marginRight:"0px"}}
                {...this.props?.labelProps} 
                label = {<span style={{fontSize: "0.8em"}}>{this.props?.label ?? ""}</span>}
                
            />

        )
    }
}

export default FactsCheckbox;