import React, { Component } from "react";
import { ChangePageDataSetState, ExecuteLayoutEventMethods } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { ViewState } from '@devexpress/dx-react-scheduler';

import { Scheduler, Appointments, MonthView, Toolbar, DateNavigator, TodayButton, AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import { ownStore } from "../../../AppOwnState/ownState";
 
class FactsDevScheduler extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentDS : this.getCurrentDataSet(), 
            selectedDate : null
        }
    }
    
    componentDidMount(){
        this.mounted = true; 
        if (this.props.datasets && this.props.datasets.length > 0) {
      
           this.unsubscribe = ownStore.subscribe((storeInfo) => {
                if (this.mounted) {
                    // if(![storeInfo.dset, "this"].includes(this.props.datasets[0])) return; 
                    if(storeInfo.dset === "this" || storeInfo.dset ===this.props.datasets[0] ) { 
                    let newDS = this.getCurrentDataSet();
                    // if (JSON.stringify(newDS) !== JSON.stringify(this.state.currentDS)) {
                        this.setState({
                            currentDS : newDS
                        });
                    // }
                }
                }
            });
        }
    }

    getCurrentDataSet = () => {
        let listds = ChangePageDataSetState(this.props.datasets);
        return listds[this.props.datasets[0]];
    }

 
    ripOffControlSpecificAttributes = () => {
        const excluded = ["datasets", "refData"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));
    }

  
    componentWillUnmount(){
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }
 
 
    handleOnChange = async (date) => {
    
        this.setState({
            selectedDate: date
        }, async () => {
             await ExecuteLayoutEventMethods(this.props.whenchange, date);
        });

    } 

    render(){ 
        let newProps = this.ripOffControlSpecificAttributes();
        let listArrayToRender = this.state.currentDS;
         return (
            <Scheduler
            className="factsDevScheduler"
            data={listArrayToRender} {...newProps}>
                <ViewState currentDate={Date.now()} />
                <MonthView timeTableCellComponent={(cellProps)=> <MonthView.TimeTableCell 
            onClick= {(e)=> this.handleOnChange(cellProps.startDate)} {...cellProps} />}>
                    
                </MonthView>
                <Appointments />
                <AppointmentTooltip showCloseButton />
                <Toolbar />
                <DateNavigator  />
                <TodayButton />
            </Scheduler>
        );
    }

}

export default FactsDevScheduler;