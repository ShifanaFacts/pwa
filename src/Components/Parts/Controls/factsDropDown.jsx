import React, { Component } from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
  getProcessedDynamic,
} from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { ownStore } from "../../../AppOwnState/ownState";
import { Checkbox } from "@mui/material";

class FactsDropDown extends Component {
    constructor(props) {
        super(props);
        
        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";
        this.listdset = getProcessedDynamic(props.listdset);
        let _listData = ownStore.getState(this.props.listdset);

        // let selectValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." + props.bind + "]");
        let selectValueFromState = props.initialvalue;
        if (this.props.dset && this.props.bind) {
            selectValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
                (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                + props.bind + "]", props.refData);
        }

        this.state = {
            selectValue:  this.emptyIfValueNotValid(selectValueFromState),
            listData: _listData
        }

    }

    emptyIfValueNotValid(value){
        if(this.props?.SelectProps?.multiple && !Array.isArray(value)) return [];
        else return value; 
    }

    componentDidMount() {
        this.mounted = true;

        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                 
                //Commented by Eins : 04-11-2022
                // if (storeInfo.dset === "this" || storeInfo.dset === this.props.dset) {
                //     let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.props.bind + "]");
                //     // if (this.state.textValue !== newState) {
                //         // if (newState === null) newState = "";
                //         this.setState({
                //             selectValue: this.emptyIfValueNotValid(newState)
                //         });

                //     // }
                // }

                if ([storeInfo.dset, "raw"].includes(this.props.dset) &&
                (storeInfo.field ?? this.props.bind) === this.props.bind) {

                if (this.props.dset && this.props.bind) {
                    let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." +
                        (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                        + this.props.bind + "]", this.props.refData);

                    if (this.state.selectValue !== newState) {
                        this.setState({
                            selectValue: this.emptyIfValueNotValid(newState)
                        });

                    }
                }
            }

                if (storeInfo.dset === "this" || storeInfo.dset === this.listdset) {
                    let newList = ownStore.getState(this.listdset);
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
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }

    async saveCurrentTextToDataset() {
        if (this.props.dset && this.props.bind) {            
        //Commented by Eins : 04-11-2022
        // await ExecuteLayoutEventMethods([

        //     {
        //         exec: "setdatasetfield",
        //         args: {
        //             dset: this.props.dset,
        //             fieldname: this.props.bind,
        //             data: this.state.selectValue
        //         }
        //     }
        // ]);
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
                                [this.props.bind]: this.state.selectValue
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
                            data: this.state.selectValue
                        }
                    }
                ]);
            }
        }
        
    }

    async runCustomOnChangeEvents() {

        await this.saveCurrentTextToDataset();
        await ExecuteLayoutEventMethods(this.props.whenchange, {...this.props.refData,...this.state});

    }
    async handleOnChange(e) {
        this.setState({
            selectValue: e.target.value
        }, () => {
            this.runCustomOnChangeEvents();
        });
    }
    async handleOnClick(item) {
        await ExecuteLayoutEventMethods(this.props.whenitemclick, {...this.props.refData,...item});
    }
 

    render() {

        return (

            <TextField className="factsDropdown" size="small" {...this.props} select={true} 
                value={this.state.selectValue ?? (this.props.SelectProps?.multiple ? [] : null)} 
                onChange={(e) => this.handleOnChange(e)}  
 
                SelectProps={this.props.SelectProps ? { 
                
                    ...this.props.SelectProps, 
                    renderValue: option => {
                            console.log(option);
                            return  this.state.listData?.filter(t=> option.includes(t[this.props.valuefield]))
                                .map(t=> <span className="multi-select-ddl-item">{t[this.props.textfield]}</span>)
                    
                    } 
                } : null
                }
                >
                {this.state.listData?.map && this.state.listData?.map((t, index) => {
                    return <MenuItem value={t[this.props.valuefield]} key={index} onClick={()=>this.handleOnClick(t)}  >
                        {this.props.SelectProps?.multiple ? 
                       <Checkbox size="small" style={{padding: "2px"}} checked = {(this.state.selectValue ?? []).includes(t[this.props.valuefield])} ></Checkbox>
                       :<></>}
                       {t[this.props.textfield]}
                    </MenuItem>
                })}
            </TextField>

        );
    }
}

export default FactsDropDown;