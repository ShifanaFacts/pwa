import React, { Component } from "react";
// import Paper from '@mui/material/Paper';
// import {
//     Chart,
//     PieSeries,
//     Title,

// } from '@devexpress/dx-react-chart-material-ui';

// import { Animation } from '@devexpress/dx-react-chart';
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export,
  Legend,
} from "devextreme-react/pie-chart";
import { Grid } from "@mui/material";
import { GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// const data = [
//     { country: 'Russia', area: 12 },
//     { country: 'Canada', area: 7 },
//     { country: 'USA', area: 7 },
//     { country: 'China', area: 7 },
//     { country: 'Brazil', area: 6 },
//     { country: 'Australia', area: 5 },
//     { country: 'India', area: 2 },
//     { country: 'Others', area: 55 },
//     { country: 'Canada', area: 7 },
//     { country: 'USA', area: 7 },
//     { country: 'China', area: 7 },
//     { country: 'Brazil', area: 6 },
//     { country: 'Australia', area: 5 },
//     { country: 'India', area: 2 },
//     { country: 'Others', area: 55 }
// ];

class PieChartComponent extends Component {
  constructor(props) {
    super(props);
    let chartData = {};
    console.log("The props value here is ", this.props);
    chartData = GetControlPropertyFromStoreOrRefData(
      this.props.data,
      this.props.refData
    );
    console.log("The Chartdata is here is ", chartData);

    this.state = {
      chartData: chartData,
      // chartTitle: props.chartTitle,
      valueField: props.valueField,
      argumentField: props.argField,
      chartType: props.chartType,
    };
    console.log("The State Data is ", this.state);

    this.pointClickHandler = this.pointClickHandler.bind(this);
    this.legendClickHandler = this.legendClickHandler.bind(this);
  }

  render() {
    // const { data: chartData } = this.state;
    // return (
    //     <Paper style={{ margin: "1px" }}>
    //         {this.state?.chartData ?
    //             <Chart data={this.state?.chartData}
    //                 onPointClick={this.pointClickHandler}
    //                 onLegendClick={this.legendClickHandler}
    //             >
    //                 <PieSeries
    //                     valueField={this.state?.valueField}
    //                     argumentField={this.state?.argumentField}>
    //                     {this.props?.labelVisible ?
    //                         <Label visible={this.props?.labelVisible}>
    //                             {this.props?.connectorVisible ?
    //                                 <Connector visible={this.props?.connectorVisible} width={1} /> :
    //                                 <></>}
    //                         </Label> :
    //                         <></>}
    //                 </PieSeries>
    //                 {this.props?.chartTitle ?
    //                     <Title text={this.state?.chartTitle} /> :
    //                     <></>}
    //                 <Animation />
    //                 {/* <Legend  /> */}
    //                 {this.props?.exportEnabled ?
    //                     <Export enabled={this.props?.exportEnabled} /> :
    //                     <></>}
    //             </Chart> :
    //             <></>}
    //     </Paper>
    // );
    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          {this.state?.chartData ? (
            <PieChart
              id="pie"
              {...this.props}
              dataSource={this.state?.chartData}
              palette={this.props?.palette}
              // title={this.state?.chartTitle}
              onPointClick={this.pointClickHandler}
              onLegendClick={this.legendClickHandler}
            >
              <Series
                valueField={this.state?.valueField}
                argumentField={this.state?.argumentField}
                type={this.state?.chartType}
              >
                {this.props?.labelVisible ? (
                  <Label visible={this.props?.labelVisible}>
                    {this.props?.connectorVisible ? (
                      <Connector
                        visible={this.props?.connectorVisible}
                        width={1}
                      />
                    ) : (
                      <></>
                    )}
                  </Label>
                ) : (
                  <></>
                )}
              </Series>
              {this.props?.legend ? (
                <Legend
                  visible={this.props.legend.legendVisible}
                  orientation={this.props.legend.legendOrientation}
                  horizontalAlignment={
                    this.props.legend.legendHorizontalAlignment
                  }
                  verticalAlignment={this.props.legend.legendVerticalAlignment}
                  itemTextPosition={this.props.legend.legendItemTextPosition}
                />
              ) : (
                <></>
              )}

              {this.props?.graphSize ? (
                <Size width={this.props.graphSize} />
              ) : (
                <></>
              )}

              {this.props?.exportEnabled ? (
                <Export enabled={this.props?.exportEnabled} />
              ) : (
                <></>
              )}
            </PieChart>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    );
  }

  pointClickHandler(e) {
    this.toggleVisibility(e.target);
  }

  legendClickHandler(e) {
    const arg = e.target;
    const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  toggleVisibility(item) {
    item.isVisible() ? item.hide() : item.show();
  }
}

export default PieChartComponent;
