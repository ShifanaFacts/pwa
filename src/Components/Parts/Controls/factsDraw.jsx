import React, { Component } from "react";

import CanvasDraw from "react-canvas-draw";
import { ownStore } from "../../../AppOwnState/ownState";
// import store from "../../../AppRedux/store";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";


class FactsDraw extends Component {
    constructor(props) {
        super(props);
        this.saveableCanvas = React.createRef();
    }

    ripOffControlSpecificAttributes() {

        const excluded = ["whenchange"];
        return (
            Object.keys(this.props)
                .filter((t) => !excluded.includes(t))
                .reduce((obj, key) => {
                    obj[key] = this.props[key];
                    return obj;
                }, {}));

    }

    componentDidMount() {
        this.mounted = true;
        this.timeStamp = GetControlPropertyFromStoreOrRefData("[func.today]");
        if (this.props.dset) {
            this.unsubscribe = ownStore.subscribe(() => {
                if (this.mounted && this.saveableCanvas) {
                    //Todo Differential Rendering
                    let action = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + ".action]");
                    let tStamp = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + ".ts]");
                    if (tStamp != this.timeStamp) {
                        this.timeStamp = tStamp; 
                        switch (action) {
                            case "undo":
                                this.saveableCanvas.undo();
                                break;
                            case "clear":
                                this.saveableCanvas.clear();
                                break;
                        }
                    }
                }
            });
        }
    }
    componentWillUnmount(){
        if(this.unsubscribe) this.unsubscribe(); 
        this.mounted = false;
    }

    async canvasOnChange() {
        if (this.saveableCanvas) {
            // let drawCanvas = this.saveableCanvas.canvas.drawing; 
            //  let imageData = drawCanvas.toDataURL(this.props.type ??  "image/jpeg"); 
            console.log(this.saveableCanvas);
            let drawCanvas = this.saveableCanvas; 
            let imageData = drawCanvas.getDataURL( this.props.type ?? "jpeg",false, 
                                                this.props.type  === "jpeg" ?  "#fff" : undefined); 
            await ExecuteLayoutEventMethods([

                {
                    exec: "setdatasetfield",
                    args: {
                        dset: this.props.dset,
                        fieldname: "data",
                        data: imageData
                    }
                }
            ]);
            if (this.props.whenchange) await ExecuteLayoutEventMethods(this.props.whenchange, imageData);
        }
    }

    render() {
        let newProps = this.ripOffControlSpecificAttributes();
        return (
            <CanvasDraw brushRadius={2} lazyRadius={0} immediateLoading={true}
        
                ref={cDraw => this.saveableCanvas = cDraw}
                onChange={() => this.canvasOnChange()} {...newProps}
                                
                style={{ position: "relative", width: "100%", ...newProps.style }} />
        );
    }
}

// let ctx = drawCanvas.getContext("2d");
// ctx.fillStyle = "rgb(200,0,0)";
// ctx.fillRect(0,0,drawCanvas.width,drawCanvas.height);

export default FactsDraw;