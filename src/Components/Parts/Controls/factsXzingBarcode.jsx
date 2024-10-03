import { useState } from "react";
import { useZxing } from "react-zxing";
import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";

export const FactsXzingBarcode = (props) => {
  const [result, setResult] = useState("");

  const { ref } = useZxing({
    timeBetweenDecodingAttempts: 150,
    onDecodeResult(result) {
      if (result) {
        setResult(result.getText());
        ExecuteLayoutEventMethods(props.whenscan, result);
      }
    },
  });

  return (
    <>
      <video ref={ref} autoFocus={true} />
    </>
  );
};
