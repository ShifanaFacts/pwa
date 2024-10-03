import React, { Component } from "react";
import {
  Chart,
  Series,
  Export,
  CommonSeriesSettings,
  Label,
  Format,
  Tooltip,
} from "devextreme-react/chart";
import { GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
import { Grid } from "@mui/material";
import { ownStore } from "../../../AppOwnState/ownState";

class BarChartComponent extends Component {
  constructor(props) {
    super(props);
    let chartData = {};
    chartData = GetControlPropertyFromStoreOrRefData(
      this.props.data,
      this.props.refData
    );
    this.state = {
      chartData: chartData,
      // chartTitle: props.chartTitle,
      valueField: props.valueField,
      argumentField: props.argField,
      chartType: props.chartType,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.unsubscribe = ownStore.subscribe((storeInfo) => {
      if (this.mounted) {
        
        if (
         this.props.data
        ) {
          if (this.props.data) {
            let newState = GetControlPropertyFromStoreOrRefData(
              this.props.data,
              this.props.refData
            );

            this.setState({ chartData: newState });
          }
        }
      }
      // }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.mounted = false;
  }

  render() {
    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          {this.state?.chartData ? (
            <Chart
              id="chart"
              {...this.props}
              dataSource={this.state?.chartData}
              palette={this.props?.palette}
            >
              <CommonSeriesSettings
                argumentField={this.state?.argumentField}
                valueField={this.state?.valueField}
                type={this.state?.chartType}
              >
                {this.props?.labelVisible ? (
                  <Label visible={this.props?.labelVisible}>
                    {this.props?.labelPrecision ? (
                      <Format
                        type="fixedPoint"
                        precision={this.props?.labelPrecision}
                      />
                    ) : (
                      <></>
                    )}
                  </Label>
                ) : (
                  <></>
                )}
              </CommonSeriesSettings>

              {this.props.Series?.map((t) => {
                return <Series />;
              })}
              {this.props?.exportEnabled ? (
                <Export enabled={this.props?.exportEnabled} />
              ) : (
                <></>
              )}
              {this.props?.toolTipEnabled ? (
                <Tooltip enabled={this.props?.toolTipEnabled} />
              ) : (
                <></>
              )}
            </Chart>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default BarChartComponent;
