import React, { useRef, useEffect, useState } from "react";
import Gantt, {
  Tasks,
  Dependencies,
  Resources,
  ResourceAssignments,
  Column,
  Editing,
  Toolbar,
  Item,
  Validation,
  FilterRow,
  Sorting,
  HeaderFilter,
} from "devextreme-react/gantt";
import {
  ChangePageDataSetState,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";
import { ownStore } from "../../../AppOwnState/ownState";

export const FactsDevGanttChart = (props) => {
  const getCurrentDataSet = () => {
    let listds = GetControlPropertyFromStoreOrRefData(
      "[" + props.datasets + "]"
    );
    if (!listds) return null;
    return listds;
  };
  const [tasks, setData] = useState(getCurrentDataSet());
  // const tasks = GetControlPropertyFromStoreOrRefData(props.datasets);
  // const tasks = GetControlPropertyFromStoreOrRefData("[" + props.datasets + "]");
  const dependencies = GetControlPropertyFromStoreOrRefData(
    "[" + props.dependencies + "]"
  );
  const resources = GetControlPropertyFromStoreOrRefData(
    "[" + props.resources + "]"
  );
  const resourceAssignments = GetControlPropertyFromStoreOrRefData(
    "[" + props.resourceAssignments + "]"
  );
  const otherprops = { ...props };
  delete otherprops.dependencies;
  delete otherprops.resources;
  delete otherprops.resourceAssignments;
  useEffect(() => {
    let unsubscribe = ownStore.subscribe((storeInfo) => {
      if (
        props.datasets[0] === storeInfo.dset ||
        props.datasets[0] === "this" ||
        props.watch?.includes(storeInfo.dset)
      ) {
        let newDS = getCurrentDataSet();
        setData(newDS);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  });

  return (
    <Gantt
      {...otherprops}
      taskListWidth={props?.taskListWidth}
      scaleType={props?.scaleType}
      height={props?.height}
      showResources={props?.showResources}
      showDependencies={props?.showDependencies}
      showRowLines={props?.showRowLines}
      taskTitlePosition={props?.taskTitlePosition}
    >
      <Tasks dataSource={tasks} />
      <Dependencies dataSource={dependencies} />
      <Resources dataSource={resources} />
      <ResourceAssignments dataSource={resourceAssignments} />

      <Toolbar>
        {props?.toolbarparams?.allowUndo == true ? <Item name="undo" /> : <></>}
        {props?.toolbarparams?.allowRedo == true ? <Item name="redo" /> : <></>}
        <Item name="separator" />
        {props?.toolbarparams?.allowCollapseAll == true ? (
          <Item name="collapseAll" />
        ) : (
          <></>
        )}
        {props?.toolbarparams?.allowExpandAll == true ? (
          <Item name="expandAll" />
        ) : (
          <></>
        )}
        <Item name="separator" />
        {props?.toolbarparams?.allowAddTask == true ? (
          <Item name="addTask" />
        ) : (
          <></>
        )}
        {props?.toolbarparams?.allowDeleteTask == true ? (
          <Item name="deleteTask" />
        ) : (
          <></>
        )}
        <Item name="separator" />
        {props?.toolbarparams?.allowZoomIn == true ? (
          <Item name="zoomIn" />
        ) : (
          <></>
        )}
        {props?.toolbarparams?.allowZoomOut == true ? (
          <Item name="zoomOut" />
        ) : (
          <></>
        )}
      </Toolbar>

      {props.columns?.map((t, i) => {
        return (
          <Column
            dataField={t?.dataField}
            caption={t?.caption}
            width={t?.width}
            allowSorting={t?.allowSorting}
          />
        );
      })}

      {props?.allowAutoUpdateParentTasks == true ? (
        <Validation autoUpdateParentTasks />
      ) : (
        <></>
      )}
      {props?.allowEdit == true ? <Editing enabled /> : <></>}
      {props?.allowFilter == true ? <FilterRow visible /> : <></>}
      {props?.allowHeaderFilter == true ? <HeaderFilter visible /> : <></>}
      {props?.sortingMode ? (
        <Sorting mode={props.sortingMode ?? "single"}></Sorting>
      ) : (
        <></>
      )}
    </Gantt>
  );
};
