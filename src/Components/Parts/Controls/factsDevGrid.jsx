import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  Grouping,
  GroupPanel,
  Sorting,
  Summary,
  TotalItem,
  GroupItem,
} from "devextreme-react/data-grid";
import React, { useRef, useEffect, useState } from "react";
import { ownStore } from "../../../AppOwnState/ownState";
import {
  ChangePageDataSetState,
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";
import PureJSComponentFactory from "../../Pages/Factory/pureJSComponentFactory";
import { formatNumber, _formatDateTime } from "../../../General/funcExecutor";

export const FactsDevGrid = (props) => {
  const gridRef = useRef(null);

  const getCurrentDataSet = () => {
    let listds = ChangePageDataSetState(props.datasets);
    if (!listds) return null;
    return listds[props.datasets[0]];
  };

  const getCurrentColumns = (data) => {
    let columninfo =
      props?.columnspecs ??
      GetControlPropertyFromStoreOrRefData("[" + props.columninfo?.dset + "]");
    if (!columninfo) return null;
    return columninfo;
  };

  const getSummaryItems = (data) => {
    let summaryIteminfo = props?.summaryItems;
    if (!summaryIteminfo) return null;
    return summaryIteminfo;
  };

  const getSummaryGroupItems = (data) => {
    let summaryGroupIteminfo = props?.summaryGroupItems;
    if (!summaryGroupIteminfo) return null;
    return summaryGroupIteminfo;
  };

  const [autoExpandAll, setAutoExpandAll] = useState(true);
  const [data, setData] = useState(getCurrentDataSet());
  const [columns, setColumns] = useState(getCurrentColumns(data));
  const [summaryItems, setSummaryItems] = useState(getSummaryItems(data));
  const [summaryGroupItems, setSummaryGroupItems] = useState(getSummaryGroupItems(data));
  const dsRowIndex = GetControlPropertyFromStoreOrRefData("[[raw.dsDevGridIndex[pagemenuinfo.doctype]]]");
  // const [focusedRowKey, setFocusedRowKey] = useState(dsRowIndex ?? 0);
  const [selectedRows, setSelectedRows] = useState([]);

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

  //conditional formatting based on cell
  const onCellPrepared = (e) => {
    if (e.rowType === "data") {
      let cellrenderedConditionally = false;
      if (props.conditionalFormat) {
        props.conditionalFormat.map((t) => {
          if (t.fieldName == e.column.Data) {
            let flag = GetControlPropertyFromStoreOrRefData(
              t.condition,
              e.data
            );
            if (flag) {
              cellrenderedConditionally = true;
              if (t.appearance) {
                Object.assign(e.cellElement.style, t.appearance);
              }
            }
          }
        });
      }
      if (cellrenderedConditionally == false) {
        if (e.column.cssClass != "") {
          e.cellElement.classList.add(e.column.cssClass);
        } else if (e.column.appearance) {
          Object.assign(e.cellElement.style, e.column.appearance);
        }
      }
    }
  };

  //conditional formatting based on row
  const onRowPrepared = (e) => {
    if (props.conditionalFormat) {
      props.conditionalFormat.map((t) => {
        if (t?.applyToRow) {
          if (t.applyToRow == true) {
            let flag = GetControlPropertyFromStoreOrRefData(
              t.condition,
              e.data
            );
            if (flag) {
              if (t.appearance) {
                // for(let apKey of Object.keys(e.columns[i].appearance)){
                //     e.rowElement.style[apKey] = e.columns[i].appearance[apKey];
                // }
                Object.assign(e.rowElement.style, t.appearance);
              }
            }
          }
        }
      });
    }
  };

  const handleRowClicked = async (data) => {
    if (props?.whenrowclick) {
      await ExecuteLayoutEventMethods(props.whenrowclick, data);
    }
    if (props.events?.onRowClick != null) {
      await ExecuteLayoutEventMethods(props.events?.onRowClick, data);
    }
  };

  const handleRowDblClicked = async (data) => {
    if (props?.whenrowdblclick) {
      await ExecuteLayoutEventMethods(props.whenrowdblclick, data);
    }
    if (props.events?.onRowDblClick != null) {
      await ExecuteLayoutEventMethods(props.events?.onRowDblClick, data);
    }
  };

  const onCellClicked = async (e, data) => {
    if (!e.event.timeOutHandler)
      e.event.timeOutHandler = setTimeout(() => {
        e.event.timeOutHandler = null;
      }, 300);
    if (e.column?.events?.onCellClick != null) {
      await ExecuteLayoutEventMethods(e.column.events.onCellClick, data);
    }
  };

  const onCellDblClicked = async (e, data) => {
    clearTimeout(e.event.timeOutHandler);
    e.event.timeOutHandler = null;
    if (e.column?.events?.onCellDblClick != null) {
      await ExecuteLayoutEventMethods(e.column.events.onCellDblClick, data);
      e.event.stopImmediatePropagation();
    }
  };

  useEffect(() => {
    ExecuteLayoutEventMethods(props.whenselectionchange, selectedRows);
  }, [selectedRows]);

  const handleSelectionChange = async (data) => {
    if (data != null) {
      setSelectedRows(data.selectedRowsData ?? []);
    }
  };

  const handleFocusedRowChanged = async (index, data) => {
    // if (data != null) {
    //   setFocusedRowKey(data.propkey);
    // }
    // await ExecuteLayoutEventMethods([{
    //     exec: "setdataset",
    //     args: {
    //         dset:"[raw.dsDevGridIndex[pagemenuinfo.doctype]]",
    //         data: index ?? 0
    //     }
    // }], data);
    await ExecuteLayoutEventMethods(props.whenfocusedrowchanged, data);
  };
  let exportThingy = undefined;
  if (props.export)
    exportThingy = { ...props.export, formats: Array.isArray(props.export?.formats) ? props.export?.formats : [props.export?.formats ?? "xlsx"] }
  props = { ...props, export: exportThingy };
  const otherprops = { ...props };
  delete otherprops.focusedRowIndex;
  delete otherprops.keyExpr;
  return (
    <DataGrid
      className="factsDevGrid"
      // id="gridContainer"
      // ref={gridRef}
      dataSource={data}
      // defaultColumns={columns}
      focusedRowEnabled={true}
      // focusedRowKey={focusedRowKey}
      keyExpr={otherprops.keyExpr ?? "propkey"}
      width="100%"
      allowColumnReordering={true}
      allowColumnResizing={true}
      showColumnLines={true}
      showRowLines={true}
      showBorders={true}
      onCellPrepared={(t) => onCellPrepared(t)}
      onRowPrepared={onRowPrepared}
      onSelectionChanged={
        props?.whenselectionchange &&
        (
          (t) => handleSelectionChange(t)
        )
      }
      onFocusedRowChanged={
        props?.whenfocusedrowchanged &&
        (
          (t) => handleFocusedRowChanged(t?.rowIndex, t?.row?.data)
        )
      }
      onRowDblClick={
        (props.events?.onRowDblClicked || props?.whenrowdblclick) &&
        (
          (t) => handleRowDblClicked(t?.data)
        )
      }
      onRowClick={
        (props.events?.onRowClicked || props?.whenrowclick) &&
        (
          (t) => handleRowClicked(t?.data)
        )
      }
      onCellClick={(t) => onCellClicked(t, t?.data)}
      onCellDblClick={(t) => onCellDblClicked(t, t?.data)}
      {...otherprops}>
      {props?.allowSorting && <Sorting mode="multiple" />}
      {props?.editable && (
        <Editing
          mode="cell"
          allowUpdating={props.editable?.canupdate ?? true}
          allowAdding={props.editable?.canadd ?? true}
          allowDeleting={props.editable?.candelete ?? true}
          {...props.editable}
        />
      )}
      <GroupPanel visible={true} />
      <Grouping autoExpandAll={autoExpandAll} />
      <Summary>
        {summaryItems?.map((t, i) => {
          return <TotalItem {...t} />;
        })}
        {summaryGroupItems?.map((t, i) => {
          return <GroupItem {...t} />;
        })}
      </Summary>
      {/* <StateStoring enabled={true} type="localStorage" storageKey="storage" savingTimeout={100}/> */}
      {columns?.map((t, i) => {
        return (
          <Column
            key={i}
            caption={t[props.columninfo?.captionfield]}
            dataField={t[props.columninfo?.datafield]}
            width={t[props.columninfo?.widthfield]}
            {...t}
            editCellRender={
              t[props.columninfo?.editprops?.chldfield] &&
              ((dataInfo) => {
                const scaff = new PureJSComponentFactory().scaffoldComponent(
                  t[props.columninfo?.editprops?.chldfield],
                  dataInfo
                );
                if (scaff) return scaff;
                else return <span>{dataInfo?.displayValue}</span>;
              })
            }
            cellComponent={(dataInfo) => {
              let dv = dataInfo?.data?.displayValue;
              if (dv?.toString) dv = dv.toString();

              if (t?.dataType === "date" || t?.dataType === "datetime") {
                dv = _formatDateTime(dv, t?.format);
              } else if (t?.dataType === "number") {
                dv = formatNumber(dv, t?.format);
              }

              if (!t?.columnEdit) return <span>{dv}</span>;

              let columnJSON = t?.columnEdit;
              return new PureJSComponentFactory().scaffoldComponent(
                columnJSON,
                dataInfo?.data
              );
            }}
            groupCellRender={(dataInfo) => {
              const scaff = new PureJSComponentFactory().scaffoldComponent(
                t.groupProps,
                dataInfo
              );
              if (scaff) return scaff;
              else return <span>{dataInfo?.value}</span>;
            }}
          />
        );
      })}
    </DataGrid>
  );
};
