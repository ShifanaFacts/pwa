import React, { Component } from "react";
import PieChartComponent from "../Parts/Charts/pieChartComponent";
import { Grid } from "@mui/material";
import BarChartComponent from "../Parts/Charts/barChartComponent";
import LineChartComponent from "../Parts/Charts/lineChartComponent";

class DashBoardComponent extends Component {

    render() {

        return (
            <Grid container spacing={3}>
                <Grid xs={12} md={6} >
                    <PieChartComponent />
                </Grid>
                <Grid xs={12} md={6} container>
                    <Grid xs={6} >
                        <LineChartComponent />
                    </Grid>
                    <Grid xs={6} >
                        <BarChartComponent />
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}

export default DashBoardComponent; 