import React, { Component } from "react";
import NumberBox from "devextreme-react/number-box";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsDevNumberBoxLabel extends Component {
  constructor(props) {
    super(props);
    this.rowIndex =
      GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

    this.CompanyParameters = GetControlPropertyFromStoreOrRefData(
      "[dsCompanyParameters]",
      props.refData
    );

    if (props?.controltype == "qty") {
      this.numberFormat =
        this.CompanyParameters?.QTY_FORMAT == undefined ||
        this.CompanyParameters?.QTY_FORMAT == ""
          ? "##,###.00"
          : this.CompanyParameters?.QTY_FORMAT;
    } else {
      this.numberFormat =
        this.CompanyParameters?.CURRENCY_FORMAT == undefined ||
        this.CompanyParameters?.CURRENCY_FORMAT == ""
          ? "##,###.00"
          : this.CompanyParameters?.CURRENCY_FORMAT;
    }
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

            if (this.finalValue !== newState) {
              if (newState === null) newState = "";
              this.finalValue = newState;

              this.setState({
                numberValue: newState,
              });
            }
          }
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.mounted = false;
  }

  async changeBinding() {
    if (this.props.dset && this.props.bind) {
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
                [this.props.bind]: this.state.numberValue,
              },
            },
          },
        ]);
      } else {
        await ExecuteLayoutEventMethods([
          {
            exec: "setdatasetfield",
            args: {
              dset: this.props.dset,
              fieldname: this.props.bind,
              data: this.state.numberValue,
            },
          },
        ]);
      }
    }
  }

  render() {
    return (
      <div className="dx-fieldset dx-field numberBoxLabel">
        <NumberBox
          className="devNumberBoxLabel"
          format={this.numberFormat}
          {...this.props}
          value={this.props?.value}
        />
      </div>
    );
  }
}

export default FactsDevNumberBoxLabel;
