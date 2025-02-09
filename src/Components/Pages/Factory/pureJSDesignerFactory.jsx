/*
    COPY OF ComponentFactory exclusively for //!LAYOUT DESIGNER
*/
import React from 'react';

import { ButtonGroup, Icon } from '@mui/material';

// import FactsDataGrid from '../../Parts/ControlsERP/factsDataGrid';

import FactsExpansionPanel from '../../Parts/Controls/factsExpansionPanel';
// import FactsSwipeList from '../../Parts/Controls/factsSwipeList';
import FactsButton from '../../Parts/Controls/factsButton';
import FactsEntry from '../../Parts/Controls/factsEntry';
import FactsFAB from '../../Parts/Controls/factsFAB';
import FactsDropDown from '../../Parts/Controls/factsDropDown';
import FactsVirtualList from '../../Parts/Controls/factsVirtualList';
import { GetControlPropertyFromStoreOrRefData, getProcessedArgs } from '../../../General/commonFunctions';
import FactsList from '../../Parts/Controls/factsList';

import FactsLabel from '../../Parts/Controls/factsLabel';
import FactsIconButton from '../../Parts/Controls/factsIconButton';
import FactsDatePicker from '../../Parts/Controls/factsDatePicker';
import FactsLookup from '../../Parts/Controls/factsLookup';
import FactsTimePicker from '../../Parts/Controls/factsTimePicker';
// import FactsDevList from '../../Parts/Controls/factsDevList';
import FactsClickRecognizer from '../../Parts/Controls/factsClickRecognizer';
import FactsFileButton from '../../Parts/Controls/factsFileButton';
import FactsImage from '../../Parts/Controls/factsImage';
import FactsAvatar from '../../Parts/Controls/factsAvatar';
// import FactsHidden from '../../Parts/Controls/factsHidden';
// import FactsPDFPreview from '../../Parts/Controls/factsPDFPreview';
// import FactsERPChart from '../../Parts/ControlsERP/factsERPChart';
import FactsCanvas from '../../Parts/Controls/factsCanvas';
// import FactsExtraContent from '../../Parts/Controls/factsExtraContent';
import FactsRenderer from '../../Parts/Controls/factsRenderer';
import FactsCheckbox from '../../Parts/Controls/factsCheckbox';
import FactsFABMulti from '../../Parts/Controls/factsFABMulti';
import FactsSection from '../../Parts/Controls/factsSection';
import FactsTreeview from '../../Parts/Controls/factsTreeview';
import FactsQRCode from '../../Parts/Controls/factsQRCode';
import FactsBarCode from '../../Parts/Controls/factsBarCode';
import FactsDevScheduler from '../../Parts/Controls/factsDevScheduler';
// import FactsHTMLView from '../../Parts/Controls/factsHTMLView';
import FactsDraw from '../../Parts/Controls/factsDraw';
import FactsSlider from '../../Parts/Controls/factsSlider';
import FactsRadioGroup from '../../Parts/Controls/factsRadioGroup';
import FactsDesignerDummy from '../../Parts/Controls/factsDesignerDummy';
import FactsTabControl from '../../Parts/Controls/factsTabControl';
import FactsHtmlEditor from '../../Parts/Controls/factsHtmlEditor';
 

class PureJSDesignerFactory {

    scaffoldComponent(layout, refData = null) {
        let layoutArray = layout;
        if (typeof layout === "string") layoutArray = GetControlPropertyFromStoreOrRefData(layout, refData);

        if (layoutArray && Array.isArray(layoutArray)) {
            return (
                layoutArray.map(
                    (ctrl, index) => {
                        let currentCtrl =  ctrl; 
                        if (typeof ctrl === "string") currentCtrl = GetControlPropertyFromStoreOrRefData(ctrl, refData);

                        
                        let ctrlChildren = null;
                        if (currentCtrl.chld) {

                            if (Array.isArray(currentCtrl.chld)) {
                                ctrlChildren = this.scaffoldComponent(currentCtrl.chld, refData);
                            }
                            else if (typeof currentCtrl.chld === "string") {
                                ctrlChildren = GetControlPropertyFromStoreOrRefData(currentCtrl.chld, refData);

                                if (Array.isArray(ctrlChildren)) {
                                    ctrlChildren = this.scaffoldComponent(ctrlChildren, refData);
                                }
                            }
                        }
                        // let typeClassSplit = currentCtrl.type.split("$"); 
                        let controlType = this._getControlTypeFromKey( currentCtrl.type); //typeClassSplit[0]);
                        // let typeClass = typeClassSplit?.length > 1 ? typeClassSplit[1] : undefined; 
                        let resolvedProps = {};
                        if (currentCtrl.props && currentCtrl.props?.resolveprops) {
                            resolvedProps = {
                                // className : typeClass, 
                                 "resolveprops": undefined, ...getProcessedArgs(currentCtrl.props, refData, undefined, true), 
                                //  "whenclick": currentCtrl.props.whenclick 
                                };
                        }
                         let styleProps =  {style : currentCtrl.props?.style}
                        if (currentCtrl.props?.style && currentCtrl.props?.resolvestyles) {
                            styleProps = { "resolvestyles": undefined, style: getProcessedArgs(currentCtrl.props.style, refData) };
                        }
                        if(styleProps.style?.display === "none") styleProps =  {style : {...styleProps.style, display: "inline-block"}}; 
                        // let ctrlProps = currentCtrl.props ? { key: index, ...currentCtrl.props, ...styleProps } : { key: index, ...styleProps };
                        let ctrlProps = { type:  currentCtrl.type,  key: index, ...currentCtrl.props, ...resolvedProps, ...styleProps };
                        if (ctrlProps.includerefdata) ctrlProps = { refData: refData, ...ctrlProps, "includerefdata": undefined };
                        return (React.createElement(controlType, ctrlProps, ctrlChildren)); 
                    }
                )
            );
        }
    }

    _getControlTypeFromKey(elementKey) {
        switch (elementKey.toLowerCase()) {
            //Charts
            case "echart": return (FactsDesignerDummy);
            case "entry": return (FactsEntry);
            case "chbox": return (FactsCheckbox);
            case "dtpick": return (FactsDatePicker);
            case "tmpick": return (FactsTimePicker);
            case "lbl": return (FactsLabel);
            case "imgr": return (FactsImage);
            case "canv": return (FactsCanvas);
            // case "pdf": return (FactsPDFPreview);
            case "sect": return (FactsSection);
            case "ftbl": return (FactsDesignerDummy); //(FactsDataGrid);
            case "expanel": return (FactsExpansionPanel);
            case "swplist": return (FactsDesignerDummy); // (FactsSwipeList);
            case "btngroup": return (ButtonGroup);
            case "hide": return "span";// return (FactsHidden);
            case "btn": return (FactsButton);
            case "filebtn": return (FactsFileButton);
            case "icbtn": return (FactsIconButton);
            case "fab": return (FactsFAB);
            case "mfab": return (FactsFABMulti);
            case "icon": return (Icon);
            case "ddl": return (FactsDropDown);
            case "lkup": return (FactsLookup);
            case "dxlist": return  (FactsDesignerDummy); // (FactsDevList);
            case "dxgrid":  return (FactsDesignerDummy);
            case "vlist": return (FactsVirtualList);
            case "list": return  (FactsList);
            case "click": return (FactsClickRecognizer);
            case "favatar": return (FactsAvatar);
            case 'xcnt':  return  (FactsDesignerDummy); // return (FactsExtraContent);
            case "render": return (FactsRenderer);
            case "tree": return (FactsTreeview);
            case "qrscan": return (FactsQRCode);
            case "bcscan": return (FactsBarCode);
            case "dxsched": return (FactsDevScheduler);
            case "view": return (FactsDesignerDummy);
            case "draw": return (FactsDraw);
            case "slider": return (FactsSlider);
            case "radio": return (FactsRadioGroup);

            case "custom": return (FactsDesignerDummy);
            case "fragment": return (FactsDesignerDummy);
            case "tab": return (FactsDesignerDummy);
            case "htmleditor": return (FactsHtmlEditor);
            default: return elementKey;
        }

    }

}

export default PureJSDesignerFactory; 