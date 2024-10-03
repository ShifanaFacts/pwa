import React, { Component } from "react";
import { Autocomplete, Chip, TextField } from "@mui/material";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsAutoCompleteChip extends Component {
  constructor(props) {
    super(props);
    this.rowIndex =
      GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";
    let _listData = ownStore.getState(this.props.listdset);

    let selectValueFromState = GetControlPropertyFromStoreOrRefData(
      "[" + props.dset + "." + props.bind + "]"
    );
    if (_listData == undefined || _listData === null) {
      _listData = [];
    }
    if (selectValueFromState == undefined || selectValueFromState === null) {
      selectValueFromState = "";
    }

    if (typeof selectValueFromState === "string") {
      let newValueFromState = selectValueFromState;
      selectValueFromState = [];
      if (newValueFromState.includes(props.separator)) {
        selectValueFromState = newValueFromState.split(props.separator);
      }
      if (selectValueFromState.length == 0) {
        if (
          newValueFromState == "" ||
          newValueFromState == undefined ||
          newValueFromState == null
        ) {
          selectValueFromState = [];
        } else {
          selectValueFromState[0] = newValueFromState;
        }
      }
    }
    this.state = {
      selectValue: this.emptyIfValueNotValid(selectValueFromState),
      listData: _listData ?? [],
    };
  }

  emptyIfValueNotValid(value) {
    if (this.props?.SelectProps?.multiple && !Array.isArray(value)) return [];
    else return value;
  }

  componentDidMount() {
    this.mounted = true;

    this.unsubscribe = ownStore.subscribe((storeInfo) => {
      if (this.mounted) {
        if (
          [storeInfo.dset, "raw"].includes(this.props.dset) &&
          (storeInfo.field ?? this.props.bind) === this.props.bind
        ) {
          if (this.props.dset && this.props.bind) {
            let newState = GetControlPropertyFromStoreOrRefData(
              "[" +
                this.props.dset +
                "." +
                (this.rowIndex === "" ? "" : this.rowIndex + ".") +
                this.props.bind +
                "]",
              this.props.refData
            );

            if (typeof newState === "string") {
              let newValueFromState = newState;
              newState = [];
              if (newValueFromState.includes(this.props.separator)) {
                newState = newValueFromState.split(this.props.separator);
              }
              if (newState.length == 0) {
                if (
                  newValueFromState == "" ||
                  newValueFromState == undefined ||
                  newValueFromState == null
                ) {
                  newState = [];
                } else {
                  newState[0] = newValueFromState;
                }
              }
            }

            if (this.state.selectValue !== newState) {
              this.setState({
                selectValue: this.emptyIfValueNotValid(newState),
              });
            }
          }
        }

        if (
          storeInfo.dset === "this" ||
          storeInfo.dset === this.props.listdset
        ) {
          let newList = ownStore.getState(this.props.listdset);
          let thisListString = JSON.stringify(this.state.listData);
          let newListString = JSON.stringify(newList);
          if (thisListString !== newListString) {
            this.setState({
              listData: newList ?? [],
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
      let newValueFromState;
      if (this.props.separator) {
        newValueFromState = this.state.selectValue.join(this.props.separator);
      }
      if (this.rowIndex !== "") {
        let rowData = GetControlPropertyFromStoreOrRefData(
          "[" + this.props.dset + "." + this.rowIndex + "]",
          this.props.refData
        );
        await ExecuteLayoutEventMethods([
          {
            exec: "mergedatasetarray",
            args: {
              noprocess: true,
              dset: this.props.dset,
              index: parseInt(this.rowIndex),
              data: {
                ...rowData,
                [this.props.bind]: newValueFromState,
              },
            },
          },
        ]);
      } else {
        await ExecuteLayoutEventMethods([
          {
            exec: "setdatasetfield",
            args: {
              noprocess: true,
              dset: this.props.dset,
              fieldname: this.props.bind,
              data: newValueFromState,
            },
          },
        ]);
      }
    }
  }

  async runCustomOnChangeEvents() {
    await this.saveCurrentTextToDataset();
    await ExecuteLayoutEventMethods(this.props.whenchange, {
      ...this.props.refData,
      ...this.state,
    });
  }

  async handleOnChange(e, v) {
    this.setState(
      {
        selectValue: v,
      },
      () => {
        this.runCustomOnChangeEvents();
      }
    );
  }

  render() {
    return (
      <Autocomplete
        clearIcon={false}
        options={this.state.listData?.map((option) => option.description)}
        freeSolo
        multiple
        value={this.state.selectValue ?? []}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              className="autocomplete-chip"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            className="autocomplete-textfield"
            label={this.props.label}
            {...params}
          />
        )}
        onChange={(e, v) => this.handleOnChange(e, v)}
        {...this.props}
      />
    );
  }
}
export default FactsAutoCompleteChip;
