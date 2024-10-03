import React, { Component } from "react";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { Slider } from "@mui/material";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsSlider extends Component {


    constructor(props) {
        super(props);
        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

        let val = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
            this.rowIndex + "." + props.bind + "]", props.refData);
        this.state = {
            value: (val === null ? 0 : val)
        }
        this.finalValue = (val === null ? 0 : val);

    }

    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                if (storeInfo.dset === "this" || storeInfo.dset === this.props.dset) {

                    let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex + "." + this.props.bind + "]", this.props.refData);
                    if (this.finalValue !== newState) {

                        if (newState === null) newState = false;
                        this.finalValue = newState;

                        this.setState({
                            value: newState
                        });

                    }
                }
            }
        });

    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.unsubscribe) this.unsubscribe();

    }


    async saveCurrentTextToDataset() {
        this.finalValue = this.state.value;
        if (this.rowIndex !== "") {
            let rowData = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex + "]", this.props.refData);

            await ExecuteLayoutEventMethods([
                {
                    exec: "mergedatasetarray",
                    args: {
                        dset: this.props.dset,
                        index: parseInt(this.rowIndex),
                        data: 
                            {
                                ...rowData,
                                [this.props.bind]: this.state.value
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
                        data: this.state.value
                    }
                }
            ]);
        }
    }

    async runCustomOnChangeEvents() {
        await this.saveCurrentTextToDataset();
        if (this.props.whenchange) await ExecuteLayoutEventMethods(this.props.whenchange, this.props.refData);

    }


    handleOnChange(event, newValue) {
        this.finalValue = newValue;
        this.setState({
            value: newValue
        }, () => {
            this.runCustomOnChangeEvents();
        });
    };


    ripOffControlSpecificAttributes() {
        const excluded = ["resolveprops", "refData", "rowindex"];
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

        return (
            <Slider className="factsSlider"
                {...newProps}
                value={this.state.value}
                onChange={this.handleOnChange.bind(this)}
            />

        )
    }
}

export default FactsSlider;