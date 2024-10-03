import Hidden from '@mui/material/Hidden';
import React, { Component } from "react";
import { getProcessedArgs } from '../../../General/commonFunctions';
// import store from '../../../AppRedux/store';
import { ownStore } from '../../../AppOwnState/ownState';


//To conditionally hide the children 
class FactsHidden extends Component {

    constructor(props) {
        super(props);
        let _propsRedux = null;
        if (props.appendprops) _propsRedux = getProcessedArgs(props.appendprops, this.props.refData);
      
        this.state = {
            propsRedux: _propsRedux
        }
    }
    ripOffControlSpecificAttributes() {

        const excluded = ["refData", "appendprops", "resolveprops", "includerefdata"];
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
     
        if (this.props.appendprops) {
            this.unsubscribe = ownStore.subscribe(() => {
                if (this.mounted) {

                    let newState = getProcessedArgs(this.props.appendprops, this.props.refData);
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

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (JSON.stringify(this.state) === JSON.stringify(nextState)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    render() {
        
        let newProps = this.ripOffControlSpecificAttributes();

        return (
            <Hidden className="factsHidden" {...newProps}   {...this.state.propsRedux} >{this.props.children}</Hidden>
        );
    }
}
export default FactsHidden; 