import React from 'react';
import PieChartComponent from '../../Parts/Charts/pieChartComponent';
import BarChartComponent from '../../Parts/Charts/barChartComponent';
import LineChartComponent from '../../Parts/Charts/lineChartComponent';

import AreaChartComponent from '../../Parts/Charts/areaChartComponent';

import { Grid, TextField } from '@mui/material';
import FactsDataGrid from '../../Parts/Controls/FactsDataGrid';
 

class JSXComponentFactory  {

    scaffoldComponent(layout) {
        if (layout) {
            return (
                layout.map(
                    (ctrl, index) => {
                        let ctrlChildren = null;
                        if (ctrl.chld) {

                            if (Array.isArray(ctrl.chld)) {
                                ctrlChildren = this.scaffoldComponent(ctrl.chld);
                            }
                            else if (typeof ctrl.chld === "string") {
                                ctrlChildren = ctrl.chld;
                            }
                        }
                        ctrl.props = ctrl.props ? { key: index, ...ctrl.props } : { key: index };

                        return this._getControlTypeFromKey(ctrl.type,  ctrl.props, ctrlChildren );

                        // return React.createElement(controlType, ctrl.props, ctrlChildren)
                    }
                )
            );
        }
    }

    _getControlTypeFromKey(elementKey, props, chld) {
        switch (elementKey.toLowerCase()) {
            //Charts
            case "piechart":
                return (
                    <PieChartComponent {...props} >
                        {chld ? chld.map(t=> t) : null}
                    </PieChartComponent>

                );
            case "barchart":  
                return (
                    <BarChartComponent {...props} >
                        {chld ? chld.map(t=> t) : null}
                    </BarChartComponent>

                );
            case "linechart":
                return (
                    <LineChartComponent {...props} >
                        {chld ? chld.map(t=> t) : null}
                    </LineChartComponent>
                );
            case "areachart":
                return (
                    <AreaChartComponent {...props} >
                        {chld ? chld.map(t=> t) : null}
                    </AreaChartComponent>
                );
            case "entry":
                return (<TextField  {...props} ></TextField>); 
             //Containers
            case "sect":  
                return (
                    <Grid {...props} >
                        {chld ? chld.map(t=> t) : null}
                    </Grid>
                );
            case "ftbl":  
                return (
                    <FactsDataGrid {...props} >
                        {chld ? chld.map(t=> t) : null}
                    </FactsDataGrid>
                );
            default: return elementKey;
        }

    }

}

export default JSXComponentFactory; 