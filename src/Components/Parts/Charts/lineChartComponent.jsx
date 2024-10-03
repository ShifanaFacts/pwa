import React, { Component } from 'react';
// import Paper from '@mui/material/Paper';
// import {
//     Chart,
//     LineSeries,
//     SplineSeries,
//     ValueAxis,
//     ArgumentAxis,
//     Legend,
//     Title,
//     Tooltip
// } from '@devexpress/dx-react-chart-material-ui';

import {
    Chart,
    Series,
    ArgumentAxis,
    CommonSeriesSettings,
    Export,
    Legend,
    Margin,
    Title,
    Subtitle,
    Tooltip,
    Grid,
    Size
} from 'devextreme-react/chart';
import { GetControlPropertyFromStoreOrRefData } from '../../../General/commonFunctions';


// const generateData = () => {
//     // const data =  [
//     //     { lineValue: 37, argument: 1970},
//     //     { lineValue: 42.5, argument: 1975},
//     //     { lineValue: 36, argument: 1980},
//     //     { lineValue: 28.7, argument: 1985},
//     //     { lineValue: 16.5, argument: 1990},
//     //     { lineValue: 33, argument: 1995},
//     //     { lineValue: 45, argument: 2000},
//     //     { lineValue: 41, argument: 2005},
//     //     { lineValue: 17, argument: 2010},
//     // ] ; 

//     return data;
// };

class LineChartComponent extends Component {
    constructor(props) {
        super(props);

        let chartData = {}
        console.log("The props value here is ", this.props)
        chartData = GetControlPropertyFromStoreOrRefData(this.props.data, this.props.refData)
        console.log("The Chartdata is here is ", chartData)

        this.state = {
            chartData: chartData,
            chartTitle: props.chartTitle,
            valueField: props.valueField,
            argumentField: props.argField,
            chartType: props.chartType
        };
        console.log("The State Data is ", this.state)
    }

    render() {
        // const { data: chartData } = this.state;
        // return (
        //     <Paper style={{ margin: "1px" }}>
        //         {this.props?.chartData ?
        //             <Chart
        //                 data={this.state?.chartData}
        //             >
        //                 <ValueAxis max={25} min={0} />

        //                 <ArgumentAxis valueMarginsEnabled={this.props.argumentAxis?.valueMarginsEnabled} />

        //                 <LineSeries
        //                     valueField={this.state?.valueField}
        //                     argumentField={this.state?.argumentField}
        //                 />
        //                 {/* <SplineSeries
        //                 valueField="lineValue"
        //                 argumentField="argument"
        //             />  */}
        //                 {this.props?.chartTitle ?
        //                     <Title text={this.state?.chartTitle} /> :
        //                     <></>}
        //                 {this.props?.legend ?
        //                     <Legend
        //                         verticalAlignment={this.props.legend?.verticalAlignment}
        //                         horizontalAlignment={this.props.legend?.horizontalAlignment}
        //                         itemTextPosition={this.props.legend?.itemTextPosition}
        //                     /> :
        //                     <></>}
        //                 {this.props?.exportEnabled ?
        //                     <Export enabled={this.props?.exportEnabled} /> :
        //                     <></>}
        //                 {this.props?.enableTooltip ?
        //                     <Tooltip enabled={this.props.enableTooltip} /> :
        //                     <></>}
        //             </Chart> :
        //             <></>}
        //     </Paper>
        // );
        return (
            <Grid container={true}>
                <Grid item={true} xs={12}>
                    {this.state?.chartData ?
                        <Chart dataSource={this.state?.chartData}>
                            {
                                this.state.chartData.map((item) =>
                                    <Series
                                        type={this.state?.chartType} key={item.valueField}
                                        name={item.argumentField}
                                        valueField={item.valueField}
                                        argumentField={item.argumentField}
                                    />)
                            }
                            <Margin bottom={20} />
                            <ArgumentAxis
                                valueMarginsEnabled={false}
                                discreteAxisDivisionMode="crossLabels"
                            >
                                {this.props?.gridVisible ?
                                    <Grid visible={this.props?.gridVisible} /> :
                                    <></>}
                            </ArgumentAxis>
                            {this.props?.legend ?
                                <Legend orientation={this.props.legend.legendOrientation}
                                    horizontalAlignment={this.props.legend.legendHorizontalAlignment}
                                    verticalAlignment={this.props.legend.legendVerticalAlignment}
                                    itemTextPosition={this.props.legend.legendItemTextPosition}
                                /> :
                                <></>}

                            {this.props?.graphSize?
                                <Size width={this.props.graphSize} /> : 
                                <></>}

                            {this.props?.exportEnabled ?
                                <Export enabled={this.props?.exportEnabled} /> :
                                <></>}
                            {this.state?.chartTitle ?
                                <Title text={this.state?.chartTitle} /> :
                                <></>}
                            {this.props?.toolTipEnabled ?
                                <Tooltip enabled={this.props?.toolTipEnabled} /> :
                                <></>}
                        </Chart> :
                        <></>}
                </Grid>
            </Grid>
        );
    }
}

export default LineChartComponent; 