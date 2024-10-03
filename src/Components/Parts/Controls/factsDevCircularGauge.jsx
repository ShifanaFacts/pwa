import React, { Component } from "react";
import {
    CircularGauge,
    RangeContainer,
    Range,
} from 'devextreme-react/circular-gauge';

class FactsDevCircularGauge extends Component {
    constructor(props) {
        super(props);
        this.otherprops = { ...this.props };
        delete this.otherprops.rangeContainer;
    }
    render() {
        return (
            <CircularGauge
                id="gauge"
                {...this.otherprops}>
                <RangeContainer {...this.props.rangeContainer}>
                    {this.props.rangeContainer.range.map((r, i) => {
                        return <Range {...r} />
                    })}
                </RangeContainer>
            </CircularGauge>
        );
    }
}
export default FactsDevCircularGauge;
