import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";

export const FactsReactBarcode = (props) => {
  // const [data, setData] = React.useState("Not Found");

  const onUpdate = async (err, result) => {
    if (result) {
      // setData(result.text);
      // if (data) {
        await ExecuteLayoutEventMethods(props.whenscan, result?.text);
      }
    // } else setData("No Barcode Found!");
  };

  return (
    <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={onUpdate}
      />
      {/* <p>Scanned Barcode : {data}</p> */}
    </>
  );
};

