import React, { Component } from "react";
import NumberBox from "devextreme-react/number-box";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsDevNumberBox extends Component {
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

    let numberValueFromState = props.initialvalue;

    if (this.props.dset && this.props.bind) {
      numberValueFromState = GetControlPropertyFromStoreOrRefData(
        "[" +
          props.dset +
          "." +
          (this.rowIndex === "" ? "" : this.rowIndex + ".") +
          props.bind +
          "]",
        props.refData
      );
    }
    this.state = {
      numberValue: numberValueFromState === null ? "" : numberValueFromState,
    };
    this.finalValue = numberValueFromState === null ? "" : numberValueFromState;
    this.isChangeDirty = false;
    this.isBlurDirty = false;
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

  handleOnValueOnChange(e) {
    this.setState(
      {
        numberValue: e.value,
      },
      async () => {
        await this.changeBinding();
        await ExecuteLayoutEventMethods(this.props.whenchange, {
          ...this.props.refData,
          ...this.state,
        });
      }
    );
    // }
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
  handleOnFocusOut = async (e) => {
    // await ExecuteLayoutEventMethods(this.props?.onFocusOut, data);
    this.setState(
      {
        numberValue: parseFloat(
          e.component._parsedValue == null ||
            e.component._parsedValue == undefined
            ? e.component._changedValue
            : e.component._parsedValue
        ),
      },
      async () => {
        await this.changeBinding();

        await ExecuteLayoutEventMethods(this.props.onFocusOut, {
          ...this.props.refData,
          ...this.state,
        });

        if (this.state.numberValue != this.state.prevNumberValue) {
          await ExecuteLayoutEventMethods(this.props.onValidated, {
            ...this.props.refData,
            ...this.state,
          });
        }
      }
    );
  };

  handleOnFocusIn = async (e) => {
    this.setState(
      {
        prevNumberValue: parseFloat(
          e.component._parsedValue == null ||
            e.component._parsedValue == undefined
            ? e.component._changedValue
            : e.component._parsedValue
        ),
      },
      async () => {
        await this.changeBinding();
        await ExecuteLayoutEventMethods(this.props?.onFocusIn, {
          ...this.props.refData,
          ...this.state,
        });
      }
    );
  };

  handleOnChange = async (data) => {
    await ExecuteLayoutEventMethods(this.props?.onChange, data);
  };

  // handleonEnterKey = async (data) => {
  //   await ExecuteLayoutEventMethods(this.props?.onEnterKey, data);
  // };

  handleonEnterKey = async (e) => {
    this.setState(
      {
        numberValue: parseFloat(
          e.component._parsedValue == null ||
            e.component._parsedValue == undefined
            ? e.component._changedValue
            : e.component._parsedValue
        ),
      },
      async () => {
        await this.changeBinding();
        await ExecuteLayoutEventMethods(this.props.onEnterKey, {
          ...this.props.refData,
          ...this.state,
        });
      }
    );
  };

  handleonKeyUp = async (data) => {
    await ExecuteLayoutEventMethods(this.props?.onKeyUp, data);
  };

  handleonKeyDown = async (data) => {
    await ExecuteLayoutEventMethods(this.props?.onKeyDown, data);
  };

  render() {
    return (
      <div className="dx-fieldset dx-field" style={{ width: "100%" }}>
        <NumberBox
          format={this.numberFormat}
          {...this.props}
          value={this.state?.numberValue}
          onValueChanged={(e) => this.handleOnValueOnChange(e)}
          onFocusOut={(e) => this.handleOnFocusOut(e)}
          onFocusIn={(e) => this.handleOnFocusIn(e)}
          onChange={(e) => this.handleOnChange(e)}
          onEnterKey={(e) => this.handleonEnterKey(e)}
          onKeyUp={(e) => this.handleonKeyUp(e)}
          onKeyDown={(e) => this.handleonKeyDown(e)}
        />
      </div>
    );
  }
}

export default FactsDevNumberBox;
