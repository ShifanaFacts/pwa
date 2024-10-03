import React, { Component } from "react";
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import ListViewTaskTemplate from "../ControlTemplates/ListViewItem/listViewTaskTemplate";
import './factsSwipeList.css';
// import store from "../../../AppRedux/store";
import {
  ExecuteLayoutEventMethods,
  objectMatchAll,
  GetControlPropertyFromStoreOrRefData,
  getProcessedArgs,
} from "../../../General/commonFunctions";
// import Icon from "@material-ui/core/Icon";
import Icon from "@mui/material/Icon";
import ListViewCustomTemplate from "../ControlTemplates/ListViewItem/listViewCustomTemplate";
import { ownStore } from "../../../AppOwnState/ownState";
// import { IconButton } from "@material-ui/core";
import { IconButton } from "@mui/material";

class FactsSwipeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listds: [],
      currentPage: 0,
    };
  }
  ripOffControlSpecificAttributes() {
    const excluded = [
      "dset",
      "filterto",
      "refData",
      "content",
      "left",
      "right",
      "itemprops",
    ];
    return Object.keys(this.props)
      .filter((t) => !excluded.includes(t))
      .reduce((obj, key) => {
        obj[key] = this.props[key];
        return obj;
      }, {});
  }
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
    if (this.props.dset) {
      let listData = ownStore.getState(this.props.dset);
      this.setState({
        currentPage: 0,
        listds: this.filterDataset(listData),
      });
      this.unsubscribe = ownStore.subscribe((storeInfo) => {
        if (this.mounted) {
          if (
            storeInfo.dset === "this" ||
            storeInfo.dset === this.props.dset ||
            this.props.watch?.includes(storeInfo.dset)
          ) {
            let listData = ownStore.getState(this.props.dset);
            let filteredData = this.filterDataset(listData);
            // if (JSON.stringify(filteredData) !== JSON.stringify(this.state.listds)) {
            this.setState({
              currentPage: 0,
              listds: filteredData,
            });
            // }
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
    let renderList = this.state.listds;
    let pageCount = 0;
    let renderStartIndex = 0;
    if (this.props.paging) {
      pageCount = Math.ceil(renderList?.length / this.props.paging?.pagesize);
      if (isNaN(pageCount)) pageCount = 0;
      renderStartIndex =
        this.state.currentPage * this.props.paging?.pagesize ?? 20;
      let renderEndIndex = renderStartIndex + this.props.paging?.pagesize ?? 20;
      renderList = renderList?.slice(renderStartIndex, renderEndIndex);
    }
    return (
      <div {...newProps}>
        {renderList && renderList?.length > 0 ? (
          <>
            <SwipeableList threshold={0.25}>
              {renderList.map &&
                renderList.map((item, index) => {
                  let contentTemplate = this.getContentTemplate(
                    this.props.content,
                    item,
                    index
                  );
                  let leftSwipe = this.props.left;
                  let rightSwipe = this.props.right;
                  let disLeft = GetControlPropertyFromStoreOrRefData(
                    this.props.itemprops?.disableleft,
                    item
                  );
                  if (disLeft) leftSwipe = null;
                  let disRight = GetControlPropertyFromStoreOrRefData(
                    this.props.itemprops?.disableright,
                    item
                  );
                  if (disRight) rightSwipe = null;
                  return (
                    <div
                      key={index + renderStartIndex}
                      style={this.props.itemprops?.style}
                    >
                      <SwipeableListItem
                        swipeRight={
                          leftSwipe && {
                            content: (
                              <div
                                className="swplist left"
                                style={leftSwipe.props?.style}
                              >
                                <Icon>{leftSwipe.icon}</Icon>
                                <span>{leftSwipe.text}</span>
                              </div>
                            ),
                            action: async () => {
                              await ExecuteLayoutEventMethods(
                                leftSwipe.props.whenswipe,
                                item
                              );
                            },
                          }
                        }
                        swipeLeft={
                          rightSwipe && {
                            content: (
                              <div
                                className="swplist right"
                                style={rightSwipe.props?.style}
                              >
                                <span>{rightSwipe.text}</span>
                                <Icon>{rightSwipe.icon}</Icon>
                              </div>
                            ),
                            action: async () => {
                              await ExecuteLayoutEventMethods(
                                rightSwipe.props.whenswipe,
                                item
                              );
                            },
                          }
                        }
                        // onSwipeProgress={progress => console.info(`Swipe progress: ${progress}%`)}
                      >
                        {contentTemplate}
                      </SwipeableListItem>
                    </div>
                  );
                })}
            </SwipeableList>
            {this.props.paging && pageCount > 0 && (
              <div style={{ padding: "5px" }} {...this.props.paging?.props}>
                {[...Array(pageCount).keys()].map((pn) => (
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => this.setState({ currentPage: pn })}
                    {...this.props.paging?.numberprops}
                    style={{
                      fontSize: "0.9rem",
                      width: "25px",
                      height: "25px",
                      marginLeft: "3px",
                      ...this.props.paging.numberprops?.style,
                      backgroundColor:
                        this.state.currentPage === pn ? "#AAA" : "inherit",
                    }}
                  >
                    {pn + 1}
                  </IconButton>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>{this.props?.emptytext}</div>
        )}
      </div>
    );
  }
  getContentTemplate(content, item, index) {
    switch (content.template) {
      case "lvitask":
        return (
          <ListViewTaskTemplate
            key={index}
            itemProps={content.props}
            itemObject={item}
          />
        );
      case "custom":
        return (
          <ListViewCustomTemplate
            key={index}
            itemProps={content.props}
            layout={content.chld}
            itemObject={item}
          />
        );
      default:
        return <div {...content.props} />;
    }
  }
}
export default FactsSwipeList;