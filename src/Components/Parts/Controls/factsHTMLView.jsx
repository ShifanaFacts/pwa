
// ############# JSON SNIPPET ######################
// {
//     "type" : "view", 
//     "props" : {
//         "contenttype" : "json" (or) "html",                                      [OPTIONAL; DEFAULT html]
//         "includerefdata" : true,                                                 [OPTIONAL] 
//         "style" :{},                                                             [OPTIONAL]
//         "content" :  "jsonArray []" (or) "<>html</>"  (or) "[binding-dataset]"   [REQUIRED]
//     }
// }
// ############# JSON SNIPPET ######################

import React, { Component } from "react";
import { ownStore } from "../../../AppOwnState/ownState";
// import store from "../../../AppRedux/store";
import { GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
import PureJSComponentFactory from "../../Pages/Factory/pureJSComponentFactory";

class FactsHTMLView extends Component {
    constructor(props) {
        super(props);
        let contentJSON = props.content;
        if (props.binding) contentJSON = GetControlPropertyFromStoreOrRefData(contentJSON, props.refData);
        if(typeof contentJSON === "object" ) contentJSON = JSON.stringify(contentJSON); 

        if (props.contenttype === "json") contentJSON = JSON.parse(contentJSON);

        this.state = {
            content: contentJSON
        }

    }

    ripOffControlSpecificAttributes() {

        const excluded = ["refData", "content", "contenttype"];
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

        this.unsubscribe = ownStore.subscribe(() => {

            if (this.mounted) {
                let contentJSON = this.props.content;
                if (this.props.binding) contentJSON = GetControlPropertyFromStoreOrRefData(contentJSON, this.props.refData);
                 if(typeof contentJSON === "object" ) contentJSON = JSON.stringify(contentJSON); 

                if (JSON.stringify(this.state.content) !== contentJSON) {
                    if (this.props.contenttype === "json" ) contentJSON = JSON.parse(contentJSON);
                    this.setState({
                        content: contentJSON
                    });
                }
            }
        });

    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.unsubscribe) this.unsubscribe();
    }


 

    render() {
        let props = this.ripOffControlSpecificAttributes();

        if (this.props.contenttype === "json") {
            let scaff = new PureJSComponentFactory().scaffoldComponent(this.state.content);
            return (
                <>{scaff}</>
            );
        }
        else {
            return (
                <div dangerouslySetInnerHTML={{__html: this.state.content}} {...props}></div>
            );
        }
    }

}

export default FactsHTMLView;