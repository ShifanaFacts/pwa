import React, { Component } from "react";
import {
  LinearGauge,
  RangeContainer,
  Range,
} from "devextreme-react/linear-gauge";

class FactsDevLinearGauge extends Component {
  constructor(props) {
    super(props);
    this.otherprops = { ...this.props };
    delete this.otherprops.rangeContainer;
  }
  render() {
    return (
      <LinearGauge id="gauge" {...this.otherprops}>
        <RangeContainer {...this.props.rangeContainer}>
          {this.props.rangeContainer.range.map((r, i) => {
            return <Range {...r} />;
          })}
        </RangeContainer>
      </LinearGauge>
    );
  }
}
export default FactsDevLinearGauge;