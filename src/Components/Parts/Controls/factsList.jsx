import React, { Component } from "react";
import {
  objectMatchAll,
  getProcessedArgs,
  ChangePageDataSetState,
  ExecuteLayoutEventMethods,
  getProcessedDynamic,
} from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import ListViewBubbleTemplate from "../ControlTemplates/ListViewItem/listViewBubbleTemplate";
import ListViewCustomTemplate from "../ControlTemplates/ListViewItem/listViewCustomTemplate";
import { ownStore } from "../../../AppOwnState/ownState";
import { Pagination } from "@mui/lab";

class FactsList extends Component {
  constructor(props) {
    super(props);

    this.divRef = React.createRef();
    this.dsList = getProcessedDynamic(props.datasets);
    this.watchList = getProcessedDynamic(props.watch);
    this.state = {
      currentDS: this.filterDataset(this.getCurrentDataSet()),
      currentPage: 1,
    };
  }

  ripOffControlSpecificAttributes() {
    this.scrolldown = this.props.scrolldown;

    const excluded = [
      "scrolldown",
      "content",
      "datasets",
      "refData",
      "filterto",
      "reverse",
      "filtermode",
      "filterignorecase",
      "resolveprops",
    ];
    return Object.keys(this.props)
      .filter((t) => !excluded.includes(t))
      .reduce((obj, key) => {
        obj[key] = this.props[key];
        return obj;
      }, {});
  }

  getCurrentDataSet() {
    //let dsResolved = getProcessedDynamic(this.props.datasets);
    let listds = ChangePageDataSetState(this.dsList);
    if (!listds) return null;
    let listData = listds[this.dsList[0]];
    if (this.props.reverse && Array.isArray(listData))
      listData = listData.reverse();
    return listData;
  }

  // getCurrentDataSet() {
  //     if(this.props.datasets?.length > 0 ){
  //     let listds = GetControlPropertyFromStoreOrRefData("[" + this.props.datasets[0] + "]");
  //     if(!listds) return null;
  //     if (this.props.reverse && Array.isArray(listds)) listds = listds.reverse();
  //     return listds;
  //     }
  //     return null;
  // }

  filterDataset(listData) {
    listData?.forEach &&
      listData.forEach((d, i) => {
        if (typeof d === "object") d.propkey = i;
      });
    if (this.props.filterto && listData) {
      let filterTo = getProcessedArgs(this.props.filterto, this.props.refData);
      if (filterTo) {
        return listData.filter((it) => {
          return objectMatchAll(
            it,
            filterTo,
            this.props.satisfy ?? "every",
            this.props.filtermode,
            this.props.filterignorecase
          );
        });
      } else return listData;
    } else return listData;
  }

  componentDidMount() {
    this.mounted = true;

    if (this.dsList && this.dsList.length > 0) {
      // this.setState({
      //     currentDS: this.getCurrentDataSet()
      // });
      this.scrollToDown();
      this.unsubscribe = ownStore.subscribe((storeInfo) => {
        if (this.mounted) {
          if (
            storeInfo.dset === "this" ||
            storeInfo.dset === this.dsList[0] ||
            this.watchList?.includes(storeInfo.dset)
          ) {
            let newDS = this.filterDataset(this.getCurrentDataSet());
            let newDSString = JSON.stringify(newDS),
              currentDSString = JSON.stringify(this.state.currentDS);

            if (newDSString !== currentDSString) {
              let pageCount = 0;
              let pageSize = parseInt(this.props.pagesize);
              if (isNaN(pageSize)) pageSize = 0;
              if (pageSize > 0) {
                pageCount = Math.ceil(newDS?.length / pageSize);
              }
              let pageToShow =
                pageCount >= this.state.currentPage ?  this.state.currentPage : 1;
                

              this.setState({
                currentDS: newDS,
                currentPage: pageToShow,
              });
            }
          }
        }
      });
    }
  }

  scrollToDown() {
    if (this.scrolldown === true) {
      setTimeout((t) => {
        if (this.divRef?.current?.lastChild) {
          this.divRef.current.lastChild.scrollIntoView({ block: "end" });
        } else this.scrollToDown();
      }, 25);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.scrolldown = false;
    if (this.unsubscribe) this.unsubscribe();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     if (JSON.stringify(this.state) === JSON.stringify(nextState)) {

  //         return false;
  //     } else {

  //         return true;
  //     }
  // }
  handleListScroll() {
    this.setState({});
  }

  render() {
    let newProps = this.ripOffControlSpecificAttributes();
    let listArrayToRender = this.convertToArrayIfObject(this.state.currentDS);
    let lazyStyle = newProps.lazy ? { overflow: "auto", height: "100%" } : {};

    let pageCount = 0;
    let pageSize = parseInt(this.props.pagesize);
    if (isNaN(pageSize)) pageSize = 0;
    let pagelistArray = listArrayToRender;
    if (pageSize > 0) {
      pageCount = Math.ceil(listArrayToRender?.length / pageSize);
      let fromItem = (this.state.currentPage - 1) * pageSize;
      let toItem = fromItem + pageSize;

      pagelistArray = listArrayToRender?.slice(fromItem, toItem);
    }
    return (
      <div
        ref={this.divRef}
        {...newProps}
        style={{ ...newProps.style, ...lazyStyle }}
        className={"lvlist " + (newProps?.className ?? "")}
        onScroll={() => this.handleListScroll()}
      >
        {pagelistArray &&
          pagelistArray.map &&
          pagelistArray.map((it, index) => {
            let propValue = typeof it === "string" ? { propvalue: it } : it;
            return this.getContentTemplate(
              this.props.content,
              {
                propkey: it.propkey ?? index,
                proptype: this.getValueType(it),
                ...propValue,
              },
              it.propkey ?? index,
              newProps
            );
            // let isLastItem = ind >= (this.state.currentDS.length -1)
          })}

        {pageCount > 0 && (
          <Pagination
            count={pageCount}
            showLastButton
            showFirstButton
            {...newProps?.pageprops}
            whenchange={undefined}
            page={this.state.currentPage}
            onChange={(e, v) => {
              this.setState({ currentPage: v });
              ExecuteLayoutEventMethods(newProps?.pageprops?.whenchange, {
                ...this.props.refData,
                currentPage: v,
              });
            }}
          />
        )}
      </div>
    );
  }

  convertToArrayIfObject(currentList) {
    if (currentList && !Array.isArray(currentList)) {
      return Object.keys(currentList).map((t) => {
        return {
          propkey: t,
          propval: currentList[t],
          proptype: this.getValueType(currentList[t]),
        };
      });
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

  getContentTemplate(content, item, index, parentProps) {
    switch (content.template) {
      case "lvibubble":
        return (
          <ListViewBubbleTemplate
            className="factsList"
            key={index}
            {...content.props}
            itemObject={item}
          />
        );

      case "custom":
        return (
          <ListViewCustomTemplate
            className="factsList"
            key={index}
            itemProps={content.props}
            layout={content.chld}
            itemObject={item}
            lazy={parentProps.lazy}
          />
        );
      default:
        return <div {...content.props} />;
    }
  }
}

export default FactsList;
