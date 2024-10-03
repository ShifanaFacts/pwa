import React, { Component } from 'react';
import { GetControlPropertyFromStoreOrRefData } from '../../../General/commonFunctions';
// import store from '../../../AppRedux/store';
import PieChartComponent from './pieChartComponent';
import BarChartComponent from './barChartComponent';
import LineChartComponent from './lineChartComponent';
import { ownStore } from '../../../AppOwnState/ownState';

class FactsERPChart extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    componentDidMount() {
        this.mounted = true;



        this.unsubscribe = ownStore.subscribe(() => {
            if (this.mounted) {

                let _chartTitle = GetControlPropertyFromStoreOrRefData(this.props.title, this.props.refData);
                let _chartLayoutXML = GetControlPropertyFromStoreOrRefData(this.props.layoutXML, this.props.refData);
                let _chartData = GetControlPropertyFromStoreOrRefData(this.props.data, this.props.refData);

                let _strRedChInfo = JSON.stringify(_chartLayoutXML);

                let _strRedChData = JSON.stringify(_chartData),
                    _strCurChData = JSON.stringify(this.state.chartData);

                if (this.state.chartTitle !== _chartTitle) {
                    this.setState({
                        chartTitle: _chartTitle
                    });
                }

                if (this.chartLayoutXML !== _strRedChInfo) {
                    this.chartLayoutXML = _strRedChInfo;
                    let _chartInfo = this.parseChartLayoutXML(_chartLayoutXML);
                    if (_chartInfo) {
                        this.setState({
                            chartInfo: _chartInfo
                        });
                    }
                }

                if (_strRedChData !== _strCurChData) {
                    this.setState({
                        chartData: _chartData
                    });
                }
            }
        });


    }

    parseChartLayoutXML(chartLayoutXML) {
        if (chartLayoutXML) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(chartLayoutXML, "text/xml");
            let chartXLabel = xmlDoc?.querySelector("SeriesSerializable Label");
            let chartType = chartXLabel && chartXLabel.getAttribute("TypeNameSerializable");
            let chartXItem = xmlDoc?.querySelector("SeriesSerializable Item1");
            let argField = chartXItem && chartXItem.getAttribute("ArgumentDataMember");
            let valueField = chartXItem && chartXItem.getAttribute("ValueDataMembersSerializable");
            return { chartType, argField, valueField };
        }
        return {};
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.unsubscribe) this.unsubscribe();
    }

  

    render() {
        return this.getChart(this.state.chartInfo?.chartType);
    }

    getChart(chartType) {
        switch (chartType) {
            case "PieSeriesLabel":
                return (
                    <PieChartComponent chartTitle={this.state.chartTitle}
                        argField={this.state.chartInfo?.argField}
                        valueField={this.state.chartInfo?.valueField}
                        chartData={this.state.chartData} />
                );
            case "SideBySideBarSeriesLabel":
                return (
                    <BarChartComponent chartTitle={this.state.chartTitle}
                        argField={this.state.chartInfo?.argField}
                        valueField={this.state.chartInfo?.valueField}
                        chartData={this.state.chartData} />
                );
            case "PointSeriesLabel":
                return (
                    <LineChartComponent chartTitle={this.state.chartTitle}
                        argField={this.state.chartInfo?.argField}
                        valueField={this.state.chartInfo?.valueField}
                        chartData={this.state.chartData} />
                );
            default:
                return null;
        }
    }


}
export default FactsERPChart; 
