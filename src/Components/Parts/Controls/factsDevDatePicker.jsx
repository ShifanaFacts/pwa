import React, { Component } from "react";
import DateBox from "devextreme-react/date-box";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";

import { ownStore } from "../../../AppOwnState/ownState";
import moment from "moment-timezone";
import { globalTimeZone } from "../../../General/globals";

class FactsDevDatePicker extends Component {
  constructor(props) {
    super(props);

    this.now = new Date();

    const timeZoneFromServer = globalTimeZone;
    moment.tz.setDefault(timeZoneFromServer);

    this.rowIndex =
      GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

    let dateValueFromState = null; //GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +   (this.rowIndex?? "") + "." + props.bind + "]");

    if (this.props.dset && this.props.bind) {
      dateValueFromState = GetControlPropertyFromStoreOrRefData(
        "[" + props.dset + "." + (this.rowIndex ?? "") + "." + props.bind + "]",
        props.refData
      );
    }

    this.state = {
      dateValue:
        dateValueFromState === null || dateValueFromState === undefined
          ? null
          : dateValueFromState,
    };
    this.finalValue =
      dateValueFromState === null || dateValueFromState === undefined
        ? null
        : dateValueFromState;
  }

  componentDidMount() {
    this.mounted = true;
    this.unsubscribe = ownStore.subscribe((storeInfo) => {
      if (this.mounted) {
        if (
          [storeInfo.dset, "raw"].includes(this.props.dset) &&
          (storeInfo.field ?? this.props.bind) === this.props.bind
        ) {
          // if(storeInfo.dset === "this" || storeInfo.dset === this.props.dset) {
          let newState = GetControlPropertyFromStoreOrRefData(
            "[" +
              this.props.dset +
              "." +
              (this.rowIndex ?? "") +
              "." +
              this.props.bind +
              "]",
            this.props.refData
          );

          if (this.finalValue !== newState) {
            if (newState === null) newState = "";
            this.finalValue = newState;

            this.setState({
              dateValue: newState,
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

  handleOnChange(date) {
    // console.log(moment(date).format('YYYY-MM-DD HH:mm:ss'));
    // if(date!=null || date!=undefined || date!="") {
    this.setState(
      {
        dateValue: date.value,
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
                [this.props.bind]: this.state.dateValue,
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
              data: this.state.dateValue,
            },
          },
        ]);
      }
    }
  }

  render() {
    return (
      <div className="dx-fieldset dx-field">
        <DateBox
          {...this.props}
          value={this.state.dateValue}
          dateSerializationFormat="yyyy-MM-ddTHH:mm:ss"
          onValueChanged={(date) => this.handleOnChange(date)}
        />
      </div>
    );
  }
}

export default FactsDevDatePicker;
