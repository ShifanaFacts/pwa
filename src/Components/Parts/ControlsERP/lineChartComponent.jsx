import React, { Component } from "react";
import { Grid } from "@mui/material";
import Chart, { Series, Connector, CommonSeriesSettings } from "devextreme-react/chart";
import { Label, Tooltip } from "devextreme-react/bar-gauge";
import { SmallValuesGrouping } from "devextreme-react/pie-chart";


class LineChartComponent extends Component {

    render() {
        return (
            <Grid container={true}>
                <Grid item={true} xs={12}>
                    <Chart id="line" dataSource={this.props.chartData ?? []}
                        palette="Material" title={this.props.chartTitle} {...this.props}>
                        <CommonSeriesSettings
                            argumentField={this.props.argField ?? "Block"}
                            type="line" />
                        <Series showInLegend={false}
                            valueField={this.props.valueField ?? "Amount"} >
                            <Label visible={true} customizeText={this.customizeText} >
                                <Connector visible={true} width={1} />
                            </Label>
                            <SmallValuesGrouping threshold={35} mode="smallValueThreshold" />

                        </Series>

                        <Tooltip enabled={true} customizeTooltip={this.customizeTooltip} />
                    </Chart>

                </Grid>

            </Grid>
        );
    }

    customizeText(arg) {
        return `${arg.valueText}`;
    }
    customizeTooltip(pointInfo) {
        return {
            text: `${pointInfo.argumentText} (${pointInfo.valueText})`
        };
    }


}

export default LineChartComponent;
