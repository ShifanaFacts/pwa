import React, { Component } from "react";
import { objectMatchAll, getProcessedArgs, GetControlPropertyFromStoreOrRefData, getProcessedDynamic } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import ListViewCustomTemplate from "../ControlTemplates/ListViewItem/listViewCustomTemplate";
import { TreeItem, TreeView } from "@mui/lab";
import { Icon } from "@mui/material";
import { ownStore } from "../../../AppOwnState/ownState";


class FactsTreeview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDS: this.filterDataset(this.getCurrentDataSet())
        };
    }

    ripOffControlSpecificAttributes() {

        const excluded = ["content", "datasets", "refData", "filterto"];
        return (
            Object.keys(this.props)
                .filter((t) => !excluded.includes(t))
                .reduce((obj, key) => {
                    obj[key] = this.props[key];
                    return obj;
                }, {}));

    }

    getCurrentDataSet() {
        let listds = GetControlPropertyFromStoreOrRefData("[" + this.props.datasets[0] + "]");
        return listds;
    }

    filterDataset(listData) {
        if (this.props.filterto && listData) {
            let filterTo = getProcessedArgs(this.props.filterto, this.props.refData);
            if (filterTo) {
                return listData.filter(it => {

                    return objectMatchAll(it, filterTo);
                });
            }
            else return listData;
        }
        else return listData;
    }

    componentDidMount() {
        this.mounted = true;

        if (this.props.datasets && this.props.datasets.length > 0) {
            // this.setState({
            //     currentDS: this.getCurrentDataSet()
            // });
            this.unsubscribe = ownStore.subscribe((storeInfo) => {
                if (this.mounted) {
                    if (storeInfo.dset === "this" || storeInfo.dset === this.props.datasets[0] ||
                        this.props.watch?.includes(storeInfo.dset)) {
                        let newDS = this.getCurrentDataSet();
                        // let newDSString = JSON.stringify(newDS),
                        //     currentDSString = JSON.stringify(this.state.currentDS);

                        // if (newDSString !== currentDSString) {
                        this.setState({
                            currentDS: this.filterDataset(newDS)
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

        let newProps = this.ripOffControlSpecificAttributes();
        let listArrayToRender = this.convertToArrayIfObject(this.state.currentDS, "");


        return (
            <TreeView  {...newProps} className={"lvlist " + (newProps?.className ?? "") + "factsTreeView"}
                defaultExpanded={['3']}
                defaultCollapseIcon={<Icon>arrow_drop_down</Icon>}
                defaultExpandIcon={<Icon>arrow_right</Icon>}
                defaultEndIcon={<div style={{ width: 24 }} />} >
                {this.getContentTemplate(listArrayToRender, "")}
            </TreeView>
        );

    }

    convertToArrayIfObject(currentList, parentPropKey) {
        if (currentList) {
            if (!Array.isArray(currentList)) {
                return Object.keys(currentList).map((t) => {
                    return { "propfullkey": parentPropKey + t, "propkey": t, "propval": currentList[t], "proptype": this.getValueType(currentList[t]) }
                });
            }
            else {
                return currentList.map((t, i) => {
                    return ({ ...t, "propfullkey": parentPropKey + i.toString(), "propkey": i, "proptype": this.getValueType(t), "propval": t });
                });
            }
        }
        return currentList;

    }

    getValueType(val) {
        if (val === null) return "null";
        if (typeof val === "string") return "string";
        if (typeof val === "boolean") return "boolean";
        if (typeof val === "object") {
            if (Array.isArray(val)) return "array";
            else return "object";
        }
    }


    // renderRow(props) {
    //     const { index, style } = props;
    //     let contentTemplate = this.getContentTemplate(this.props.content, this.state.currentDS[index]);

    //     return (
    //         <div key={index} style={style}>
    //             {contentTemplate}
    //         </div>
    //     );
    // }

    getContentTemplate(listArrayToRender, nodeId, rootPropKey = "") {
        if (listArrayToRender && listArrayToRender.map) {
            return (listArrayToRender.map((it, index) => {

                let currentNodeId = nodeId + index.toString();
                let scaff = null;
                var resItemProps = getProcessedDynamic(this.props.content.itemprops, it);

                if (typeof it[this.props.datafield] === "object" && (resItemProps?.expandable ?? true)) {
                    var listToRender = this.convertToArrayIfObject(it[this.props.datafield], rootPropKey + it.propkey + ".");
                    scaff = this.getContentTemplate(listToRender, currentNodeId, rootPropKey + it.propkey + ".");
                }
                return (
                    <TreeItem key={index} nodeId={currentNodeId}  {...resItemProps} expandable={undefined} label={
                        <ListViewCustomTemplate key={index} itemProps={this.props.content.props}
                            layout={this.props.content.chld} itemObject={it} />
                    }>
                        {scaff}
                    </TreeItem>);
                // let isLastItem = ind >= (this.state.currentDS.length -1)
            }));
        }
    }


}

export default FactsTreeview; 