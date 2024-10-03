import React, { Component } from "react";
// import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";
// import PureJSComponentFactory from "../../Pages/Factory/pureJSComponentFactory";

class FactsDragSource extends Component {

    handleDrag = (ev) => {
        ev.dataTransfer.setData("dragData", this.data);
     }
   
    ripOffControlSpecificAttributes() {

        const excluded = ["layout", "refData", "whenclick"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));

    }

    render() {
        // let scaff = new PureJSComponentFactory().scaffoldComponent(this.props.layout, this.props.refData);
        let newProps = this.ripOffControlSpecificAttributes();
        return (
            <div   {...newProps} draggable={true} onDragStart={ (e) => this.handleDrag(e)}>
                {this.props.children}
            </div>
        );
    }
}

export default FactsDragSource; 