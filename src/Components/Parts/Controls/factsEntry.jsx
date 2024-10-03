import TextField from "@mui/material/TextField";
import React, { Component } from "react";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { InputBase } from "@mui/material";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsEntry extends Component {

    constructor(props) {
        super(props);
        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

        let textValueFromState = props.initialvalue;

        if (this.props.dset && this.props.bind) {
            textValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
                (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                + props.bind + "]", props.refData);
        }
        this.state = {
            textValue: (textValueFromState === null ? "" : textValueFromState)
        }
        this.finalValue = (textValueFromState === null ? "" : textValueFromState);
        this.isChangeDirty = false;
        this.isBlurDirty = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                // if (this.mounted && (!this.isChangeDirty) && (!this.isBlurDirty)) {
                if ([storeInfo.dset, "raw"].includes(this.props.dset) &&
                    (storeInfo.field ?? this.props.bind) === this.props.bind) {

                    if (this.props.dset && this.props.bind) {
                        let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." +
                            (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                            + this.props.bind + "]", this.props.refData);

                        if (this.finalValue !== newState) {

                            if (newState === null) newState = "";
                            this.finalValue = newState;

                            this.setState({
                                textValue: newState
                            });

                        }
                    }
                }
            }
            // }
        });

    }



    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }

    // bindingEscapeValue(val) {  //?Escaping handled at ExecuteEventArgs by sending args noprocess as true; Check above code
    //     if ( val?.startsWith && val.startsWith("[") && val.endsWith("]")) return " " + val + " "; //Added to escape texts which mimics inner binding
    //     else
    //         return val;
    // }
    async handleOnBlur(e) {

        e.target.reportValidity();
        let currentValue = this.escapeValues(this.state.textValue); // this.bindingEscapeValue(this.state.textValue); //?Escaping handled at ExecuteEventArgs by sending args noprocess as true; Check above code
        if (this.props.type === "number") {
            currentValue = parseFloat(currentValue);
            if (this.props.inputProps?.min) {
                let minValue = parseFloat(this.props.inputProps?.min);

                if (currentValue < minValue) currentValue = minValue;
            }
            if (this.props.inputProps?.max) {
                let maxValue = parseFloat(this.props.inputProps?.max);
                if (currentValue > maxValue) currentValue = maxValue;
            }
        }
        this.finalValue = currentValue;


        this.setState({
            textValue: currentValue
        }, async () => {
            // this.isBlurDirty = true;
            await this.saveCurrentTextToDataset();
            if (this.props.whenblur) await ExecuteLayoutEventMethods(this.props.whenblur, {parent: this.props?.refData, ...this.state});
            // this.isBlurDirty = false;
        });

    }


    async saveCurrentTextToDataset() {

        this.finalValue = this.state.textValue;

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
                                [this.props.bind]: this.state.textValue
                            }
                        }
                    }]);
            }
            else {
                await ExecuteLayoutEventMethods([

                    {
                        exec: "setdatasetfield",
                        args: {
                            noprocess: true,
                            dset: this.props.dset,
                            fieldname: this.props.bind,
                            data: this.state.textValue
                        }
                    }
                ]);
            }
        }
    }
    async runCustomOnChangeEvents(eventToRun) {
        // this.isChangeDirty = true;
        clearTimeout(this.changeTO);
        this.changeTO = setTimeout(async () => {
            await this.saveCurrentTextToDataset();

            if (eventToRun) await ExecuteLayoutEventMethods(eventToRun, {parent: this.props?.refData, ...this.props?.refData, ...this.state});
            // this.isChangeDirty = false;

        }, this.props.delay ?? 250);

    }

    escapeValues(textVal) {
        if (!this.props.regex) return textVal;
        let regex = RegExp(this.props.regex, 'g');
        return textVal?.replace(regex, '');
    }

    async handleOnChange(e) {
        let textVal = this.escapeValues(e.target.value ?? "");
        this.finalValue = textVal; // this.bindingEscapeValue(e.target.value ?? "");//?Escaping handled at ExecuteEventArgs by sending args noprocess as true; Check above code
        this.setState({
            textValue: textVal
        }, () => {

            this.runCustomOnChangeEvents(this.props.whenchange,  {parent: this.props?.refData, ...this.state});
        });
    }
    handleKeyDown(e) {

        if (this.props.acceptTab && e.keyCode === 9) {
            e.preventDefault();
            document.execCommand && document.execCommand('insertText', false, "  ");
        }
    }
    handleKeyPress(e) {

        if (e.charCode === 0) e.preventDefault();
    }
    async handleKeyUp(e) {
        e.stopPropagation();
        if (this.props.whenkeyup) {
            // if (this.isChangeDirty || this.isBlurDirty) {

            clearTimeout(this.changeTO);
            await this.saveCurrentTextToDataset();
            //     this.isChangeDirty = false;
            //     this.isBlurDirty = false;
            // }
            if (typeof this.props.eventkeys === "undefined" || this.props.eventkeys.includes(e.keyCode)) {
                await ExecuteLayoutEventMethods(this.props.whenkeyup, {parent: this.props?.refData, ...this.state});
            }
        }
    }
    handleOnFocus(e) {
        e.preventDefault();
        const { target } = e;

        target.select();
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (JSON.stringify(this.state) === JSON.stringify(nextState)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    ripOffControlSpecificAttributes() {
        const excluded = ["resolveprops", "acceptTab", "format", "refData", "rowindex"];
        return (
            Object.keys(this.props)
                .filter((t) => !excluded.includes(t))
                .reduce((obj, key) => {
                    obj[key] = this.props[key];
                    return obj;
                }, {}));

    }
    format(val) {
        if (this.props.type === "number" && this.props.format) {
            let decimals = parseInt(this.props.format);
            if (isNaN(decimals)) decimals = 2;
            let formatted = parseFloat(val).toFixed(decimals);
            if (isNaN(formatted)) formatted = "";
            return formatted;
        }
        else return val;
    }
    render() {
        let newProps = this.ripOffControlSpecificAttributes();
        let formatted = this.format(this.state.textValue);
        switch (newProps?.variant) {
            case "base":
                return (<InputBase  {...newProps} className={`${newProps.className} factsEntry`} value={formatted}
                    autoComplete="off"
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    onKeyUp={(e) => this.handleKeyUp(e)}
                    onKeyDown={(e) => this.handleKeyDown(e)}
                    onChange={(e) => this.handleOnChange(e)}
                    onBlur={(e) => this.handleOnBlur(e)}
                    onFocus={(e) => this.handleOnFocus(e)}
                />);
            default:
                return (
                    <TextField  color="primary"  variant="outlined" size="small" {...newProps} className={`${newProps?.className} factsEntry`} value={formatted}
                        autoComplete="off"
                        onKeyPress={(e) => this.handleKeyPress(e)}
                        onKeyUp={(e) => this.handleKeyUp(e)}
                        onKeyDown={(e) => this.handleKeyDown(e)}
                        onChange={(e) => this.handleOnChange(e)}
                        onBlur={(e) => this.handleOnBlur(e)}
                        onFocus={(e) => this.handleOnFocus(e)}
                    />
                );
        }

    }
}

export default FactsEntry;