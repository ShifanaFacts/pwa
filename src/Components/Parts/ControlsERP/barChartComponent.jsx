import React, { Component } from "react";
import { Grid } from "@mui/material";
import { Chart } from "devextreme-react";
import { CommonSeriesSettings, SeriesTemplate } from "devextreme-react/chart";
import { Title } from "devextreme-react/bar-gauge";



class BarChartComponent extends Component {

  ripOffControlSpecificAttributes() {
    const excluded = ["chartTitle", "chartData"];
    return (
      Object.keys(this.props)
        .filter((t) => !excluded.includes(t))
        .reduce((obj, key) => {
          obj[key] = this.props[key];
          return obj;
        }, {}));

  }
  render() {
    let newProps = this.ripOffControlSpecificAttributes();

    return (
      <Grid container={true}>
        <Grid item={true} xs={12}  >
          <Chart dataSource={this.props.chartData ?? []}
            title={this.props.chartTitle}
            palette="Soft"

            {...newProps} >
            <CommonSeriesSettings
              argumentField="Block"
              valueField="Amount"
              type="bar"
              ignoreEmptyPoints={true}
            />
            <SeriesTemplate nameField="Block" />
            <Title
              text="Age Breakdown of Facebook Users in the U.S."
              subtitle="as of January 2017"
            />

            {/* <CommonSeriesSettings
              argumentField="Block"
              type="bar"
              hoverMode="allArgumentPoints"
              selectionMode="allArgumentPoints"
            >
              <Label visible={true}>
                <Format type="fixedPoint" precision={0} />
              </Label>
            </CommonSeriesSettings>
            <Series
              valueField="Amount"
              argumentField="Block"
              showInLegend={false}
              type="bar"
              color="#009688" /> */}
            {/* <ArgumentAxis />
            <ValueAxis />

            <BarSeries
              valueField="Amount"
              argumentField="Block"

            />
            <Title text={this.props.chartTitle} />
            <Animation /> */}

          </Chart>
        </Grid>
      </Grid>
    );
  }
}

export default BarChartComponent; 