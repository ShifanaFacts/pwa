import React, { Component } from "react";
import { BarGauge } from "devextreme-react/bar-gauge";
import { CheckBox } from "devextreme-react/check-box";
import { GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";

class FactsDevBarGauge extends Component {
  constructor(props) {
    super(props);
    let gaugeData = {};
    gaugeData = GetControlPropertyFromStoreOrRefData(
      this.props.data,
      this.props.refData
    );
    this.state = {
      gaugeData: gaugeData,
      gaugeDataActivity: gaugeData.map((obj) =>
        obj.active ? obj.active : true
      ),
      values: gaugeData.map((obj) => obj.value),
    };

    this.getValueChangedHandler = (index) => (e) => {
      const gaugeDataActivity = this.state.gaugeDataActivity.slice();
      gaugeDataActivity[index] = e.value;
      this.setState({
        gaugeDataActivity,
        values: gaugeData
          .map((obj, i) => (gaugeDataActivity[i] ? obj.value : null))
          .filter((c) => c !== null),
      });
    };
  }

  render() {
    return (
      <div>
        <BarGauge {...this.props} values={this.state.values}></BarGauge>

        {this.props?.checkboxPanelEnabled ? (
          <div style={this.props?.panelStyle}>
            {this.state.gaugeDataActivity.map((status, i) => (
              <CheckBox
                key={i}
                text={this.state.gaugeData[i].name}
                value={status}
                onValueChanged={this.getValueChangedHandler(i)}
              ></CheckBox>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default FactsDevBarGauge;
