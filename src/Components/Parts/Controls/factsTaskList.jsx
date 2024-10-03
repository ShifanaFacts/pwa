import React, { Component } from "react";

import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import ListViewTaskTemplate from "../ControlTemplates/ListViewItem/listViewTaskTemplate";
import './factsTaskList.css';
// import store from "../../../AppRedux/store";
import { ChangePageDataSetState, ExecuteLayoutEventMethods } from '../../../General/commonFunctions'
import Icon from "@mui/material/Icon";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsTaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listds: {}
        };
    }

    componentDidMount() {
        this.mounted = true; 
        if (this.props.datasets && this.props.datasets.length > 0) {

            this.setState({
                listds: ChangePageDataSetState(this.props.datasets)
            });


            this.unsubscribe = ownStore.subscribe(() => {
                if(this.mounted){ 
                let newData = ChangePageDataSetState(this.props.datasets)
                if (JSON.stringify(this.state.listds) !== JSON.stringify(newData)) {
                    this.setState({
                        listds: newData
                    });
                }
                }
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.unsubscribe) this.unsubscribe();
    }

 

    render() {
        let currentDataset = this.state.listds[this.props.datasets[0]];
        return (<SwipeableList threshold={0.25}>
            {
                currentDataset ?
                    currentDataset.map((item, index) => {

                        let contentTemplate = this.getContentTemplate(this.props.content, item);
                        return (
                            <SwipeableListItem key={index}
                                swipeRight={{
                                    content:
                                        <div className="swplist left">
                                            <Icon>{this.props.left.icon}</Icon>
                                            <span>{this.props.left.text}</span>
                                        </div>,
                                    action: async () => {

                                        await ExecuteLayoutEventMethods(this.props.left.props.whenswipe, item);
                                    }
                                }}
                                swipeLeft={{
                                    content:
                                        <div className="swplist right">
                                            <span>{this.props.right.text}</span>
                                            <Icon>{this.props.right.icon}</Icon>
                                        </div>,
                                    action: async () => {
                                        await ExecuteLayoutEventMethods(this.props.right.props.whenswipe, item);
                                    }
                                }}
                            // onSwipeProgress={progress => console.info(`Swipe progress: ${progress}%`)}
                            >
                                {contentTemplate}
                            </SwipeableListItem>
                        );
                    })
                    :
                    null
            }
        </SwipeableList>);
    }

    getContentTemplate(content, dsets) {
        switch (content.template) {
            case "lvitask":
                return (<ListViewTaskTemplate {...content.props} datasets={dsets} />);
            default: return (<div {...content.props} />);
        }
    }
}

export default FactsTaskList;