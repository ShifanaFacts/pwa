import React, { Component } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsRadioGroup extends Component {
    constructor(props) {
        super(props);
        let _listData = ownStore.getState(this.props.listdset);

        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";
        let valueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
        this.rowIndex + "." + props.bind + "]", props.refData);
        // if (this.props.dset && this.props.bind) {
        //     valueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
        //         (this.rowIndex === "" ? "" : (this.rowIndex + "."))
        //         + props.bind + "]", props.refData);
        // }      
        this.state = {
            value: (valueFromState === null || valueFromState === undefined ? null : valueFromState),
            listData: _listData
        }
    }

    componentDidMount() {
        this.mounted = true;

        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                if([storeInfo.dset, "this"].includes(this.props.dset)) {
                // if ([storeInfo.dset, "this"].includes(this.props.dset) &&
                //     (storeInfo.field ?? this.props.bind) === this.props.bind) {
                    let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex +  "." + this.props.bind + "]");
                    if (this.state.value !== newState) {
                        if (newState === null) newState = "";
                        this.setState({
                            value: newState
                        });

 

                    }
                }


                if ([storeInfo.dset].includes(this.props.listdset) ) {
                    let newList = ownStore.getState(this.props.listdset);
                    let thisListString = JSON.stringify(this.state.listData);
                    let newListString = JSON.stringify(newList);
                    if (thisListString !== newListString) {
                        this.setState({
                            listData: newList
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

    async saveCurrentValueToDataset() {
        // if (this.props.dset && this.props.bind) {
            if (this.rowIndex !== "") {
                let rowData = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex + "]", this.props.refData);
                await ExecuteLayoutEventMethods([
                    {
                        exec: "mergedatasetarray",
                        args: {
                            noprocess: true,
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
        // }
    }

    async runCustomOnChangeEvents() {
        await this.saveCurrentValueToDataset();
        await ExecuteLayoutEventMethods(this.props.whenchange, { ...this.props.refData, ...this.state});

    }
    async handleOnChange(e) {
        this.setState({
            value: e.target.value
        }, () => {
            this.runCustomOnChangeEvents();
        });

    }


    ripOffControlSpecificAttributes() {
        const excluded = ["resolveprops", "format", "refData", "rowindex"];
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
            <RadioGroup className="factsRadioGroup" {...newProps}
                value={this.state.value}
                onChange={(e) => this.handleOnChange(e)} >
                {this.state.listData?.map((t, index) => {
                    return <FormControlLabel {...this.props.inputProps} value={t[this.props.valuefield]} key={index} control={<Radio />} label={t[this.props.textfield]} />
                })}
            </RadioGroup>

        );
    }
}

export default FactsRadioGroup;

