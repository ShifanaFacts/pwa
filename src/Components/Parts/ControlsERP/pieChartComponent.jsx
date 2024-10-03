import React, { Component } from "react";
import { Grid } from "@mui/material";
import { PieChart } from "devextreme-react";
import { Series, Connector } from "devextreme-react/chart";
import { Label, Legend } from "devextreme-react/bar-gauge";
import { SmallValuesGrouping } from "devextreme-react/pie-chart";


class PieChartComponent extends Component {

    render() {
        return (
            <Grid container={true}>
                <Grid item={true} xs={12}>
                    <PieChart id="pie" dataSource={this.props.chartData ?? []}
                        palette="Material" title={this.props.chartTitle} {...this.props}>
                        <Series
                            argumentField={this.props.argField ?? "Block"}
                            valueField={this.props.valueField ?? "Amount"} >
                            <Label visible={true} customizeText={this.customizeText} >
                                <Connector visible={true} width={1} />
                            </Label>
                            <SmallValuesGrouping threshold={15} mode="smallValueThreshold" />

                        </Series>

                        <Legend orientation="horizontal" itemTextPosition="right"
                            horizontalAlignment="center" verticalAlignment="bottom"
                            itemTextFormat={this.customizeText} />

                    </PieChart>

                </Grid>

            </Grid>
        );
    }

    customizeText(arg) {
        return `${arg.argumentText} ${arg.percentText}`;
    }



}

export default PieChartComponent;
