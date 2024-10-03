import React, { Component } from "react";
import { TimePicker } from '@mui/lab';
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
import { getTZPrefix, globalTimeZone } from "../../../General/globals";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from "@mui/material";
import { ownStore } from "../../../AppOwnState/ownState";
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';

class FactsTimePicker extends Component {
    constructor(props) {
        super(props);

        const timeZoneFromServer = globalTimeZone;
        moment.tz.setDefault(timeZoneFromServer)

        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

        let dateValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "."
            + (this.rowIndex === "" ? "" : (this.rowIndex + ".")) + props.bind + "]");

        // let dateInMillis = 0;
        // if (dateValueFromState) {
        //     dateInMillis = Date.parse(dateValueFromState);
        //     if (["iPhone", "iPod", "iPad", "MacIntel", "Macintosh", "MacPPC", "Mac68K"].includes(navigator.platform))
        //         dateInMillis = dateInMillis + (new Date().getTimezoneOffset() * 60 * 1000)
        // }
        // dateValueFromState = dateValueFromState + "+04:00";
        this.state = {
            dateValue: (dateValueFromState === null || dateValueFromState === undefined ? null : dateValueFromState)
        }
        this.finalValue = dateValueFromState;

    }
    // offsetForIphone(millis) {
    //     if (["iPhone", "iPod", "iPad", "MacIntel", "Macintosh", "MacPPC", "Mac68K"].includes(navigator.platform))
    //         return millis - (new Date().getTimezoneOffset() * 60 * 1000)
    // }


    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {

                if (storeInfo.dset === "this" || storeInfo.dset === this.props.dset) {
                    let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." +
                        (this.rowIndex === "" ? "" : (this.rowIndex + ".")) + this.props.bind + "]", this.props.refData);
                    if (this.finalValue !== newState) {

                        if (newState === null) newState = "";
                        this.finalValue = newState;

                        this.setState({
                            dateValue: newState
                        });

                    }
                }
            }
        });

    }



    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }
    async handleOnChange(date) {
        this.setState({
            dateValue: moment(date).format('YYYY-MM-DD HH:mm:ss')
        }, async () => {
            await this.changeBinding();
            await ExecuteLayoutEventMethods(this.props.whenchange, { parent: this.props?.refData, ...this.state });
        });

    }
    async changeBinding() {
        if (this.props.dset && this.props.bind) {
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
                                [this.props.bind]: this.state.dateValue
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
                            data: this.state.dateValue
                        }
                    }
                ]);
            }
        }
    }

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
        let modifiedDate = this.state.dateValue;
        if ((!this.props?.neveraddtz) && typeof modifiedDate === "string") //Fix for Iphone
            modifiedDate = modifiedDate + getTZPrefix();

        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker className="factsTimePicker"
                    {...newProps} 
                    value={modifiedDate}
                    onChange={(date) => this.handleOnChange(date)}
                    renderInput={(props) => <TextField {...props}  />}
                />
            </LocalizationProvider>
        );
    }

    adjustTimeForIphone() {

    }
}
export default FactsTimePicker;