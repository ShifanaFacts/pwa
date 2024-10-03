import React, {Component} from "react";

import Paper from '@mui/material/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Title,
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, Animation } from '@devexpress/dx-react-chart';
import { scalePoint } from 'd3-scale';

 
const data = [
    { year: '2010', android: 67225, ios: 46598 },
    { year: '2011', android: 179873, ios: 90560 },
    { year: '2012', android: 310088, ios: 118848 },
    { year: '2015', android: 539318, ios: 189924 },
];

class AreaChartComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
    };
  }

  render() {
    const { data: chartData } = this.state;
     return (
      <Paper style={{margin: "1px"}}>
      <Chart {...this.props}
        data={chartData}
 
      >
        <ArgumentScale factory={scalePoint} />
        <ArgumentAxis />
        <ValueAxis />

        <AreaSeries
          name="Android"
          valueField="android"
          argumentField="year"
        />
        <AreaSeries
          name="iOS"
          valueField="ios"
          argumentField="year"
        />
        <Animation />
  
        <Title
          text="Worldwide Sales to End Users by OS"
        />
      </Chart>
    </Paper>
    );
  }
}

export default AreaChartComponent; 