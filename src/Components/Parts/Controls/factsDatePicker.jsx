import React, { Component } from "react";
import { DatePicker } from '@mui/lab';
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ownStore } from "../../../AppOwnState/ownState";
import { TextField } from "@mui/material";
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import { globalTimeZone } from "../../../General/globals"
// import dayjs from 'dayjs';


class FactsDatePicker extends Component {
    constructor(props) {
        super(props);

        const timeZoneFromServer = globalTimeZone;
        moment.tz.setDefault(timeZoneFromServer)

        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

        let dateValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." + props.bind + "]");

        if (this.props.dset && this.props.bind) {
            dateValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
                (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                + props.bind + "]", props.refData);
        }

        this.state = {
            dateValue: (dateValueFromState === null || dateValueFromState === undefined ? null : dateValueFromState)
        }
        this.finalValue = (dateValueFromState === null ? "" : dateValueFromState);


    }

    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {

                if ([storeInfo.dset, "raw"].includes(this.props.dset) &&
                    (storeInfo.field ?? this.props.bind) === this.props.bind) {

                    // if(storeInfo.dset === "this" || storeInfo.dset === this.props.dset) { 
                    let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset +
                        (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                        + "." + this.props.bind + "]", this.props.refData);

                    if (this.finalValue !== newState) {

                        if (newState === null) newState = "";
                        this.finalValue = newState;

                        this.setState({
                            dateValue: newState
                        });

                    }
                    // }
                }
            }
        });

    }



    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }

    async handleOnChange(date) {
        // console.log(moment(date).format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            dateValue: moment(date).format('YYYY-MM-DD HH:mm:ss')
        }, async () => {
            await this.changeBinding()
            await ExecuteLayoutEventMethods(this.props.whenchange, { ...this.props.refData, ...this.state});
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
    render() {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}
                utils={MomentUtils}
            >
                <DatePicker className="factsDatePicker"
                    inputFormat={this.props?.format}
                    {...this.props}
                    value={this.state.dateValue}
                    onChange={(date) => this.handleOnChange(date)}
                    renderInput={(props) => <TextField {...props} />}
                />
            </LocalizationProvider>
        );
    }
}
export default FactsDatePicker;