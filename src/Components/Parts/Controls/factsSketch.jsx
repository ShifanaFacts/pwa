import React, { Component } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ownStore } from "../../../AppOwnState/ownState";
import {
  ExecuteLayoutEventMethods,
  GetControlPropertyFromStoreOrRefData,
} from "../../../General/commonFunctions";

class FactsSketch extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  ripOffControlSpecificAttributes() {
    const excluded = ["whenchange"];
    return Object.keys(this.props)
      .filter((t) => !excluded.includes(t))
      .reduce((obj, key) => {
        obj[key] = this.props[key];
        return obj;
      }, {});
  }

  componentDidMount() {
    this.mounted = true;
    this.timeStamp = GetControlPropertyFromStoreOrRefData("[func.today]");
    if (this.props.dset) {
      this.unsubscribe = ownStore.subscribe(() => {
        if (this.mounted && this.canvas) {
          //Todo Differential Rendering
          let action = GetControlPropertyFromStoreOrRefData(
            "[" + this.props.dset + ".action]"
          );
          let tStamp = GetControlPropertyFromStoreOrRefData(
            "[" + this.props.dset + ".ts]"
          );
          if (tStamp != this.timeStamp) {
            this.timeStamp = tStamp;
            switch (action) {
              case "undo":
                this.canvas.current.undo();
                break;
              case "redo":
                this.canvas.current.redo();
                break;
              case "clear":
                this.canvas.current.clearCanvas();
                break;
            }
          }
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.mounted = false;
  }

  async canvasOnChange() {
    if (this.canvas) {
      console.log(this.canvas);
      let drawCanvas = this.canvas;
      let imageData;
      await drawCanvas.current
        .exportImage(this.props.type ?? "jpeg")
        .then((res) => {
          imageData = res;
        });
      await ExecuteLayoutEventMethods([
        {
          exec: "setdatasetfield",
          args: {
            dset: this.props.dset ?? "DsSketch",
            fieldname: this.props.fieldname ?? "data",
            data: imageData,
          },
        },
      ]);
      if (this.props.whenchange)
        await ExecuteLayoutEventMethods(this.props.whenchange, imageData);
    }
  }
  render() {
    let newProps = this.ripOffControlSpecificAttributes();
    return (
      <div>
        <ReactSketchCanvas
          ref={this.canvas}
          strokeWidth={5}
          strokeColor="black"
          onStroke={() => this.canvasOnChange()}
          {...newProps}
          style={{
            border: "0.0625rem solid #9c9c9c",
            borderRadius: "0.25rem",
            ...newProps.style,
          }}
        />
      </div>
    );
  }
}
export default FactsSketch;
