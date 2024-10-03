import React, { Component } from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { ownStore } from "../../../AppOwnState/ownState";
import { Checkbox } from "@mui/material";

class FactsAutoComplete extends Component {
    constructor(props) {
        super(props);
        let _listData = ownStore.getState(this.props.listdset);

        let selectValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." + props.bind + "]");
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
                 
                if (storeInfo.dset === "this" || storeInfo.dset === this.props.dset) {
                    let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.props.bind + "]");
                    // if (this.state.textValue !== newState) {
                        // if (newState === null) newState = "";
                        this.setState({
                            selectValue: this.emptyIfValueNotValid(newState)
                        });

                    // }
                }
                if (storeInfo.dset === "this" || storeInfo.dset === this.props.listdset) {
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
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }

    async saveCurrentTextToDataset() {
        await ExecuteLayoutEventMethods([

            {
                exec: "setdatasetfield",
                args: {
                    dset: this.props.dset,
                    fieldname: this.props.bind,
                    data: this.state.selectValue
                }
            }
        ]);
    }

    async runCustomOnChangeEvents() {

        await this.saveCurrentTextToDataset();
        await ExecuteLayoutEventMethods(this.props.whenchange, this.state);

    }
    async handleOnChange(e) {
        this.setState({
            selectValue: e.target.value
        }, () => {
            this.runCustomOnChangeEvents();
        });
    }
    async handleOnClick(item) {
        await ExecuteLayoutEventMethods(this.props.whenitemclick, item);
    }
 

    render() {

        return (

            <TextField className="factsAutoComplete" size="small" {...this.props} select={true} 
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

export default FactsAutoComplete;