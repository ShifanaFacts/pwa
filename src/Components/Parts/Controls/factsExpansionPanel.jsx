import React, { Component } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { GetControlPropertyFromStoreOrRefData } from '../../../General/commonFunctions';
// import store from '../../../AppRedux/store';
import PureJSComponentFactory from '../../Pages/Factory/pureJSComponentFactory';
import { AccordionDetails, AccordionSummary, Accordion } from '@mui/material';
import { ownStore } from '../../../AppOwnState/ownState';


class FactsExpansionPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: props.expanded ?? false,
            title: GetControlPropertyFromStoreOrRefData(this.props.title, this.props.refData)
        };

    }

    ripOffControlSpecificAttributes() {

        const excluded = [ "resolveprops"];
        return (Object.keys(this.props)
            .filter((t) => !excluded.includes(t))
            .reduce((obj, key) => {
                obj[key] = this.props[key];
                return obj;
            }, {}));

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.title !== this.props.title) {
            let _expTitle = GetControlPropertyFromStoreOrRefData(nextProps.title, this.props.refData);
            if (this.state.title !== _expTitle) {
               this.setState({
                   title: _expTitle
               });
         }
        }
    }
    componentDidMount() {
        this.mounted = true;
        if (this.props.title?.startsWith("[") && this.props.title?.endsWith("]")) {
            this.unsubscribe = ownStore.subscribe(() => {
 
                if (this.mounted) {
                
                    let _expTitle = GetControlPropertyFromStoreOrRefData(this.props.title, this.props.refData);
                     if (this.state.title !== _expTitle) {
                        this.setState({
                            title: _expTitle
                        });
                  }

                }
            });
        }

    }
    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }

    handleOpen() {
        this.setState({
            expanded: !this.state.expanded
        });
    }



    render() {
        let footerScaff = new PureJSComponentFactory().scaffoldComponent(this.props.footer, this.props.refData);
        let newProps = this.ripOffControlSpecificAttributes()
        return (
            <Accordion className="factsExpansionPanel"
            {...newProps}
            
                // style={this.props.style} className={this.props.className}
             expanded={this.state.expanded} onChange={() => this.handleOpen()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />} >
                    {/*["h1","h2","h3","h4","h5","h6","subtitle1","subtitle2","body1","body2","caption","button","overline","srOnly","inherit"]. */}
                    <Typography>{this.state.title}</Typography>
                </AccordionSummary>
                <AccordionDetails className="expanel-details">{this.props.children}</AccordionDetails>
                {footerScaff}
            </Accordion>

        );
    }
}

export default FactsExpansionPanel; 