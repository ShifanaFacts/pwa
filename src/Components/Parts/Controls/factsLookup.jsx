import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import React, { Component } from "react";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { IconButton } from "@mui/material";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsLookup extends Component {
    constructor(props) {
        super(props);
        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

        let textValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +  (this.rowIndex === "" ? "" : (this.rowIndex + ".")) + props.bind + "]", this.props.refData);
        this.state = {
            textValue: (textValueFromState === null ? "" : textValueFromState)
        }
    }

    ripOffControlSpecificAttributes() {
        const excluded = ["className", "includerefdata", "refData"];
        return (
            Object.keys(this.props)
                .filter((t) => !excluded.includes(t))
                .reduce((obj, key) => {
                    obj[key] = this.props[key];
                    return obj;
                }, {}));

    }

    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            // if (![storeInfo.dset].includes(this.props.dset)) return;
            if (this.mounted) {
                if (storeInfo.dset === "this" || storeInfo.dset === this.props.dset) {
                    let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex + "." + this.props.bind + "]", this.props.refData);

                    if (this.state.textValue !== newState) {
                        this.setState({
                            textValue: newState
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

    async handleOnClick(e) {
        if(this.props.whenclick) await ExecuteLayoutEventMethods(this.props.whenclick, this.props.refData );
        else if(this.props.autoclickargs) {
          
            await ExecuteLayoutEventMethods(
                [
                    {
                      exec: "setdataset",
                      args: {
                        dset: "dslkuppopargs",
                        data: {
                            popuptitle: this.props.autoclickargs?.popuptitle,
                            popupsection: this.props.autoclickargs?.popupsection,
                            proc :  this.props.autoclickargs?.proc,
                            dataid: this.props.autoclickargs?.dataid,
                            dset : this.props.dset,
                            textfield: this.props.bind, 
                            valuefield: this.props.autoclickargs?.valuefield,
                            rowindex: this.rowIndex
                        }
                      }
                    },
                    {
                      exec: "filldataset",
                     args: {
                        proc: "PWA.LoadLayout",
                        dset: "popupinfo",
                        column: "layoutinfo",
                        section:  this.props.autoclickargs?.popupsection,
                        args: {
                          doctype:  this.props.autoclickargs?.popupdoctype,
                          docno:  this.props.autoclickargs?.popupdocno,
                        }
                      }
                    }
                  ]
                , this.props.refData );
        }
    }

    async handleEmptyIconOnClick(e) {
        e.stopPropagation();
        if (!this.props.icons?.empty?.whenclick) await this.handleOnClick(e);
        else await ExecuteLayoutEventMethods(this.props.icons?.empty?.whenclick, this.props.refData);

    }

    async handleNotEmptyIconOnClick(e) {
        e.stopPropagation();
        if (!this.props.icons?.notempty?.whenclick) await this.handleOnClick(e);
        else await ExecuteLayoutEventMethods(this.props.icons?.notempty?.whenclick, this.props.refData);

    }


    // shouldComponentUpdate(nextProps, nextState) {
    //     if (JSON.stringify(this.state) === JSON.stringify(nextState)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    render() {
        let newProps = this.ripOffControlSpecificAttributes();
        let adornIcon = null;
        if (this.props.icons) {
            if ((this.state.textValue ?? "") === "") {
                adornIcon = (<IconButton onClick={(e) => this.handleEmptyIconOnClick(e)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{padding: "0px"}} tabIndex="-1">
                    <Icon>{this.props.icons?.empty?.icon ?? this.props.icon}</Icon>
                </IconButton>);
            }
            else {
                adornIcon = (<IconButton onClick={(e) => this.handleNotEmptyIconOnClick(e)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{padding: "0px"}} tabIndex="-1">
                    <Icon>{this.props.icons?.notempty?.icon ?? this.props.icon}</Icon>
                </IconButton>);
            }
        }
        else adornIcon = <Icon>{this.props.icon}</Icon>;

        return (
            <TextField
                className={"facts-lookup " + (this.props.className ?? "")}
                variant="outlined" size="small" {...newProps}
                InputProps={{
                    readOnly: true,
                    endAdornment: <InputAdornment position="end">{adornIcon}</InputAdornment>,
                    ...newProps?.InputProps
                }}
                value={this.state.textValue ?? ""}
                // onChange={(e) => this.handleOnChange(e)} onBlur={() => this.handleOnBlur()}
                onClick={(e) => this.handleOnClick(e)} />
        )
    }
}

export default FactsLookup;