import React, { useRef, useEffect, useState } from "react";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";

import PivotGrid, { FieldChooser } from "devextreme-react/pivot-grid";
// import { sales } from "devextreme-react/pivot-grid";
import { ownStore } from "../../../AppOwnState/ownState";
import {
  ChangePageDataSetState
} from "../../../General/commonFunctions";
// import PureJSComponentFactory from "../../Pages/Factory/pureJSComponentFactory";

export const FactsDevPivotGrid = (props) => {
    const pivotGridRef =
     useRef(null);

  // var _listData = ownStore.getState(props.listdset);
   
    const getCurrentDataSet = () => {
      var _listData = ChangePageDataSetState([props.listdset]);
      if (!_listData) return null;
      _listData = _listData[props.listdset];
      return _listData;
    };

  const [data, setData] = useState(getCurrentDataSet());
  
useEffect(() => {
  let unsubscribe = ownStore.subscribe((storeInfo) => {
    if (props.listdset === storeInfo.dset || props.listdset === "this") {
      let newDS = getCurrentDataSet();
      setData(newDS);
    }
  });
  return () => {
    if (unsubscribe) unsubscribe();
  };
},[]);  
  
    const dataSource = new PivotGridDataSource({
      fields: props.fields,
      store: data,
    });

  return (
    <React.Fragment>
      <PivotGrid
        id="pivotgrid"
        dataSource={dataSource}
        ref={pivotGridRef}
      
        {...props}
      >
        <FieldChooser enabled={true} height={400} />
      </PivotGrid>
    </React.Fragment>
  );
};
