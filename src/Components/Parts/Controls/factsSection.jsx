import React, { Component } from "react";
import { Grid } from "@mui/material";
import { getProcessedDynamic } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsSection extends Component{
    constructor(props) {
        super(props);
        let _propsRedux = null;
        if (props.appendprops) _propsRedux = getProcessedDynamic(props.appendprops, this.props.refData);
        this.state = {
            propsRedux: _propsRedux
        }
     }

     ripOffControlSpecificAttributes() {

        const excluded = [ "appendprops",  "refData"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.appendprops) {
            this.unsubscribe = ownStore.subscribe(() => {
                if (this.mounted) {
                    let newState = getProcessedDynamic(this.props.appendprops, this.props.refData);
                    if (JSON.stringify(this.state.propsRedux) !== JSON.stringify(newState)) {

                        this.setState({
                            propsRedux: newState
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


    render(){
        let newProps = this.ripOffControlSpecificAttributes();
        return(
            <Grid className="factsSection" {...newProps} {...this.state.propsRedux}></Grid>
        )
    }
}

export default FactsSection; 