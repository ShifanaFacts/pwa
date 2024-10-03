import React, { Component } from "react";
import { GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsImage extends Component {
    constructor(props) {
        super(props);
        let fileContentFromState = GetControlPropertyFromStoreOrRefData(props.src, props.refData);
        let disp = "inline"
        if (!fileContentFromState && fileContentFromState === "") disp = "none";
        this.state = {
            fileContent: fileContentFromState,
            showImage: disp
        };
    }

    ripOffControlSpecificAttributes() {

        const excluded = ["src", "staticimage", "refData"];
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
        if (!this.props.staticimage) {
            this.unsubscribe = ownStore.subscribe(() => {

                if (this.mounted) {

                    let newState = GetControlPropertyFromStoreOrRefData(this.props.src, this.props.refData);
                    let disp = "inline"
                    if (!newState && newState === "") disp = "none";

                    if (this.state.fileContent !== newState) {
                        this.setState({
                            fileContent: newState,
                            showImage: disp
                        });
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
        return (
            <img className="factsImage" src={this.state.fileContent} alt="Stateful Graphic" {...newProps} style={{ display: this.state.showImage, ...newProps?.style }} />
        );
    }
}

export default FactsImage; 