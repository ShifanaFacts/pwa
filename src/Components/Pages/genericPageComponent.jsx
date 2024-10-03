import React, { Component } from "react";
import PureJSComponentFactory from "./Factory/pureJSComponentFactory";

class GenericPageComponent extends Component {

    render() {
        let scaff = new PureJSComponentFactory().scaffoldComponent(
            this.props.pageInfo?.layout,"",(this.props.pageInfo?.id ?? (Math.random() * 10000).toFixed()) //Need id in the scaffold to uniquely identify each controls (Needed by React as key), Otherwise we use here a random number to generate one (For backward compatibility)
        );

        return (<>{scaff}</>);
    }



}

export default GenericPageComponent; 