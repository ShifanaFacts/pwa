import React, { Component } from "react";
import Lookup from "devextreme-react/lookup";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
  getProcessedDynamic,
} from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsDevLookup extends Component {
  constructor(props) {
    super(props);
    this.rowIndex =
      GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

    this.listdset = getProcessedDynamic(props.listdset);
    let _listData = ownStore.getState(this.props.listdset) || [];

    let selectValueFromState = props.initialvalue;
    if (this.props.dset && this.props.valueExpr) {
      selectValueFromState = GetControlPropertyFromStoreOrRefData(
        "[" +
          props.dset +
          "." +
          (this.rowIndex === "" ? "" : this.rowIndex + ".") +
          props.valueExpr +
          "]",
        props.refData
      );
    }
    let selectDisplayFromState = "";
    if (this.props.dset && this.props.displayExpr) {
      selectDisplayFromState = GetControlPropertyFromStoreOrRefData(
        "[" +
          props.dset +
          "." +
          (this.rowIndex === "" ? "" : this.rowIndex + ".") +
          props.displayExpr +
          "]",
        props.refData
      );
    }

    if (_listData.length == 0) {
      _listData[0] = {
        [props.valueExpr]: selectValueFromState,
        [props.displayExpr]: selectDisplayFromState,
      };
    }
    this.state = {
      selectValue: this.emptyIfValueNotValid(selectValueFromState),
      selectDisplay: selectDisplayFromState,
      listData: _listData,
    };
  }

  emptyIfValueNotValid(value) {
    if (this.props?.SelectProps?.multiple && !Array.isArray(value)) return [];
    else return value;
  }

  componentDidMount() {
    this.mounted = true;
    // Initialize selectValue and selectDisplay from the dataset when the component mounts
    if (this.props.dset && this.props.valueExpr && this.props.displayExpr) {
      const initialSelectValue = GetControlPropertyFromStoreOrRefData(
        "[" +
          this.props.dset +
          "." +
          (this.rowIndex === "" ? "" : this.rowIndex + ".") +
          this.props.valueExpr +
          "]",
        this.props.refData
      );

      const initialSelectDisplay = GetControlPropertyFromStoreOrRefData(
        "[" +
          this.props.dset +
          "." +
          (this.rowIndex === "" ? "" : this.rowIndex + ".") +
          this.props.displayExpr +
          "]",
        this.props.refData
      );

      // Set initial state
      this.setState({
        selectValue: this.emptyIfValueNotValid(initialSelectValue),
        selectDisplay: initialSelectDisplay,
      });
    }

    this.unsubscribe = ownStore.subscribe((storeInfo) => {
      if (this.mounted) {
        // Handling updates to the dataset and ensuring the selectValue matches the dataset state
        if (
          [storeInfo.dset, "raw"].includes(this.props.dset) &&
          (storeInfo.field ?? this.props.valueExpr) === this.props.valueExpr
        ) {
          if (this.props.dset && this.props.valueExpr) {
            let newSelectValue = GetControlPropertyFromStoreOrRefData(
              "[" +
                this.props.dset +
                "." +
                (this.rowIndex === "" ? "" : this.rowIndex + ".") +
                this.props.valueExpr +
                "]",
              this.props.refData
            );

            if (this.state.selectValue !== newSelectValue) {
              this.setState({
                selectValue: this.emptyIfValueNotValid(newSelectValue),
              });
            }
          }
        }

        // Update list data when dataset changes
        if (storeInfo.dset === "this" || storeInfo.dset === this.listdset) {
          let newList = ownStore.getState(this.listdset);
          let thisListString = JSON.stringify(this.state.listData);
          let newListString = JSON.stringify(newList);
          if (thisListString !== newListString) {
            this.setState({
              listData: newList,
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
    if (this.props.dset && this.props.valueExpr) {
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
                [this.props.valueExpr]: this.state.selectValue,
                [this.props.displayExpr]: this.state.selectDisplay,
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
              fieldname: this.props.valueExpr,
              data: this.state.selectValue,
            },
          },
          {
            exec: "setdatasetfield",
            args: {
              noprocess: true,
              dset: this.props.dset,
              fieldname: this.props.displayExpr,
              data: this.state.selectDisplay,
            },
          },
        ]);
      }
    }
  }

  async runCustomOnChangeEvents() {
    await this.saveCurrentTextToDataset();
    await ExecuteLayoutEventMethods(this.props.whenchange, this.state);
  }

  handleOnValueChange(e) {
    const selectedItem = this.state.listData.find(
      (item) => item[this.props.valueExpr] === e.value
    );
    const displayValue = selectedItem
      ? selectedItem[this.props.displayExpr]
      : "";
    this.setState(
      {
        selectValue: e.value,
        selectDisplay: displayValue,
      },
      () => {
        this.runCustomOnChangeEvents();
      }
    );
  }

  async handleOnClick(e) {
    await ExecuteLayoutEventMethods(this.props.whenitemclick, e);
  }

  async handleOnOpen(e) {
    await ExecuteLayoutEventMethods(this.props.whenopened, e);
  }

  render() {
    return (
      <Lookup
        value={this.state.selectValue}
        dataSource={this.state.listData}
        {...this.props}
        onValueChanged={(e) => this.handleOnValueChange(e)}
        onItemClick={(e) => this.handleOnClick(e)}
        onOpened={(e) => this.handleOnOpen(e)}
      ></Lookup>
    );
  }
}

export default FactsDevLookup;
