import React, { Component } from "react";
import { ChangePageDataSetState, ExecuteLayoutEventMethods, getProcessedArgs, getProcessedDynamic, objectMatchAll } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import ListViewBubbleTemplate from "../ControlTemplates/ListViewItem/listViewBubbleTemplate";
import ListViewCustomTemplate from "../ControlTemplates/ListViewItem/listViewCustomTemplate";
import { List } from "devextreme-react";

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { ownStore } from "../../../AppOwnState/ownState";
import { Pagination } from "@mui/lab";
import { appTheme } from "../../../General/globals";

class FactsDevList extends Component {


    constructor(props) {
        super(props);

        this.state = {
            currentDS: this.filterDataset(this.getCurrentDataSet()),
            currentPage: 1 
        };
        this.divRef = React.createRef();
        this.searchExpr = getProcessedDynamic(props.searchExpr);
    }

    ripOffControlSpecificAttributes() {
        this.scrolldown = this.props.scrolldown;

        const excluded = ["scrolldown", "content", "datasets", "refData", "filterto", "reverse"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));
    }

    getCurrentDataSet() {
        let listds = ChangePageDataSetState(this.props.datasets);
        if(!listds) return null; 
        if (this.props.reverse && Array.isArray(listds)) listds = listds.reverse();

        return listds[this.props.datasets[0]];
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
            this.setState({
                currentDS: this.getCurrentDataSet()
            });
            // this.scrollToDown();

            this.unsubscribe = ownStore.subscribe((storeInfo) => {
                if (this.mounted) {
                    // if (![storeInfo.dset, "this"].includes(this.props.datasets[0])) return;
                    if (this.props.datasets[0] === storeInfo.dset || this.props.datasets[0] === "this" ||
                        this.props.watch?.includes(storeInfo.dset)) {
                        let newDS = this.getCurrentDataSet();
                        // if (JSON.stringify(newDS) !== JSON.stringify(this.state.currentDS)) {

                        this.setState({
                            currentDS: this.filterDataset(newDS),
                            currentPage: 1 
                        });
                        this.scrollToDown();
                    }
                }
                // }
            });
        }

    }

    scrollToDown() {
        if (this.scrolldown === true) {
            setTimeout(t => {
                if (this.divRef?.current?.lastChild) {
                    this.divRef.current.lastChild.scrollIntoView({ block: 'start' });
                }
                else this.scrollToDown();
            }, 25);
        }
    }

    componentWillUnmount() {
        this.scrolldown = false;
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }

    // GroupTemplate(item, key) {
    //     return <div>{item[key] ?? ""}</div>;
    // }

    render() {

    
        let newProps = this.ripOffControlSpecificAttributes();

        let listArrayToRender = this.convertToArrayIfObject(this.state.currentDS);
        let index = 0;
        let pageCount =  0;
        let pageSize = parseInt(this.props.pagesize);
        if(isNaN(pageSize)) pageSize = 0 ; 
        let pagelistArray = listArrayToRender; 
        if(pageSize > 0){ 
            pageCount = Math.ceil(listArrayToRender?.length /pageSize); 
            let fromItem = (this.state.currentPage -1) *  pageSize ; 
            let toItem = fromItem + pageSize; 
  
            pagelistArray = listArrayToRender?.slice(fromItem, toItem )
        }
        return (
            <>
                <List className="factsDevList"
                   rtlEnabled={ appTheme.direction === "rtl"}
                    dataSource={pagelistArray}
                    noDataText={ appTheme.direction === "rtl" ?  "لا توجد بيانات لعرض" : "No data to display"}
                    // height={400}
                    searchEditorOptions= { {
                        placeholder: appTheme.direction === "rtl" ?  "بحث" : "Search"
                    }}
                      onPullRefresh={(e)=> {
                        ExecuteLayoutEventMethods(e.props?.onPullRefreshEvent);
                     } }
                    
                    itemRender={(it) => {
                        let templ = this.getContentTemplate(this.props.content,
                            {
                                propkey: it.propkey ?? index,
                                "proptype": this.getValueType(it),
                                ...it
                            }, index);
                        index++;
                        return templ;
                    }
                    }
                    {...newProps}
                    searchExpr={this.searchExpr}
                    
                // groupRender={ (item)=> this.GroupTemplate(item, newProps.keyExpr ?? "key")} 
                />
           
                {pageCount > 0 &&
                <Pagination count={pageCount}  showLastButton showFirstButton
                    {...newProps?.pageprops}
                    whenchange= { undefined}
                    page={this.state.currentPage}
                    onChange={(e,v)=> {
                        this.setState({currentPage: v});
                        ExecuteLayoutEventMethods(newProps?.pageprops?.whenchange, { ...this.props.refData, currentPage: v });

                     } }
                />
                }
            </>
        );
    }

    convertToArrayIfObject(currentList) {
        if (currentList && !Array.isArray(currentList)) {
            return Object.keys(this.state.currentDS).map((t) => {
                return { "propkey": t, "propval": currentList[t], "proptype": this.getValueType(currentList[t]) }
            })
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

    getContentTemplate(content, item, index) {
        switch (content.template) {
            case "lvibubble":
                return (<ListViewBubbleTemplate key={index} {...content.props} itemObject={item} />);

            case "custom":
                return (<ListViewCustomTemplate key={index} itemProps={content.props} layout={content.chld} itemObject={item} />);
            default: return (<div {...content.props} />);
        }
    }

}

export default FactsDevList; 