import React, { Component } from "react";
import { FixedSizeList } from "react-window";
import { ChangePageDataSetState } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import ListViewBubbleTemplate from "../ControlTemplates/ListViewItem/listViewBubbleTemplate";
import AutoSizer from "react-virtualized-auto-sizer";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsVirtualList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            currentDS: {}
        };
        this.divRef = React.createRef();
    }

    getCurrentDataSet() {
        let listds = ChangePageDataSetState(this.props.datasets);
        return listds[this.props.datasets[0]];
    }

    componentDidMount() {
        this.mounted = true; 
        if (this.props.datasets && this.props.datasets.length > 0) {
            this.setState({
                currentDS: this.getCurrentDataSet()
            });
            this.scrollToDown();

            this.unsubscribe = ownStore.subscribe((storeInfo) => {
                if(this.mounted) {  
                if (storeInfo.dset === "this" || storeInfo.dset === this.props.datasets[0]) {
                    let newData = this.getCurrentDataSet();
                    if (JSON.stringify(this.state.currentDS) !== JSON.stringify(newData)) {
                        this.setState({
                            currentDS: newData
                        });
                        this.scrollToDown();
                    }
                }
                }
            });
        }

    }

    scrollToDown() {
        if (this.props.scrolldown === true) {
            setTimeout(t => {
                if (this.divRef?.current)
                    this.divRef.current.scrollTo(1000);
                else this.scrollToDown();
            }, 100);
        }
    }

    componentWillUnmount() {
        this.mounted = false; 
        if (this.unsubscribe) this.unsubscribe();
    }



    render() {

        return (
            <AutoSizer className="factsVirtualList">
                {({ height, width }) => {
                    return (
                        <FixedSizeList ref={this.divRef} height={height || 60} width={width} itemSize={60} itemCount={this.state.currentDS?.length}>
                            {this.renderRow.bind(this)}
                        </FixedSizeList>
                    );
                }}

            </AutoSizer>
        );
    }

    renderRow(props) {
        const { index, style } = props;
        let contentTemplate = this.getContentTemplate(this.props.content, this.state.currentDS[index]);

        return (
            <div key={index} style={style}>
                {contentTemplate}
            </div>
        );
    }

    getContentTemplate(content, dsets) {
        switch (content.template) {
            case "lvibubble":
                return (<ListViewBubbleTemplate {...content.props} datasets={dsets} />);
            default: return (<div {...content.props} />);
        }
    }

}

export default FactsVirtualList; 