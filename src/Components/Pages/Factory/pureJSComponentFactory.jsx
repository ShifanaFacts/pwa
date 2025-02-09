import React from 'react';

import { ButtonGroup, Icon } from '@mui/material';

import FactsDataGrid from '../../Parts/ControlsERP/factsDataGrid';

import FactsExpansionPanel from '../../Parts/Controls/factsExpansionPanel';
import FactsSwipeList from '../../Parts/Controls/factsSwipeList';
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
import FactsDevList from '../../Parts/Controls/factsDevList';
import FactsClickRecognizer from '../../Parts/Controls/factsClickRecognizer';
import FactsFileButton from '../../Parts/Controls/factsFileButton';
import FactsImage from '../../Parts/Controls/factsImage';
import FactsAvatar from '../../Parts/Controls/factsAvatar';
import FactsHidden from '../../Parts/Controls/factsHidden';
// import FactsPDFPreview from '../../Parts/Controls/factsPDFPreview';
import FactsERPChart from '../../Parts/ControlsERP/factsERPChart';
import FactsCanvas from '../../Parts/Controls/factsCanvas';
import FactsExtraContent from '../../Parts/Controls/factsExtraContent';
import FactsRenderer from '../../Parts/Controls/factsRenderer';
import FactsCheckbox from '../../Parts/Controls/factsCheckbox';
import FactsFABMulti from '../../Parts/Controls/factsFABMulti';
import FactsSection from '../../Parts/Controls/factsSection';
import FactsTreeview from '../../Parts/Controls/factsTreeview';
import FactsQRCode from '../../Parts/Controls/factsQRCode';
import FactsBarCode from '../../Parts/Controls/factsBarCode';
import FactsDevScheduler from '../../Parts/Controls/factsDevScheduler';
import FactsHTMLView from '../../Parts/Controls/factsHTMLView';
import FactsDraw from '../../Parts/Controls/factsDraw';
import FactsSlider from '../../Parts/Controls/factsSlider';
import FactsRadioGroup from '../../Parts/Controls/factsRadioGroup';
import FactsDragSource from '../../Parts/Controls/factsDragSource';
import { FactsDevGrid } from '../../Parts/Controls/factsDevGrid';
import FactsTabControl from '../../Parts/Controls/factsTabControl';
import FactsHtmlEditor from '../../Parts/Controls/factsHtmlEditor';
import PieChartComponent from '../../Parts/Charts/pieChartComponent';
import LineChartComponent from '../../Parts/Charts/lineChartComponent';
import AreaChartComponent from '../../Parts/Charts/areaChartComponent';
import BarChartComponent from '../../Parts/Charts/barChartComponent';
import FactsDevDatePicker from '../../Parts/Controls/factsDevDatePicker';
import FactsDevLookup from '../../Parts/Controls/factsDevLookup';
import FactsDevCircularGauge from '../../Parts/Controls/factsDevCircularGauge';
import { FactsDevGanttChart } from '../../Parts/Controls/factsDevGanttChart';
import FactsDevLinearGauge from '../../Parts/Controls/factsDevLinearGauge';
import FactsDevBarGauge from '../../Parts/Controls/factsDevBarGauge';
import FactsDevNumberBox from '../../Parts/Controls/factsDevNumberBox';
import FactsSketch from "../../Parts/Controls/factsSketch";
import FactsNumLabel from "../../Parts/Controls/factsNumLabel";
import FactsDevNumberBoxLabel from "../../Parts/Controls/factsDevNumberBoxLabel";
import { FactsReactBarcode } from "../../Parts/Controls/factsReactBarcode";
import { FactsXzingBarcode } from '../../Parts/Controls/factsXzingBarcode';
import FactsAutoCompleteChip from '../../Parts/Controls/factsAutoCompleteChip';
import { FactsDevPivotGrid } from '../../Parts/Controls/factsDevPivotGrid';


// import { Suspense } from 'react';
// const FactsList = React.lazy(() => import('../../Parts/Controls/factsList'));
// const FactsVirtualList =  React.lazy(() => import('../../Parts/Controls/factsVirtualList'));
// const FactsDropDown =  React.lazy(() => import( '../../Parts/Controls/factsDropDown'));
// const FactsFAB =   React.lazy(() => import( '../../Parts/Controls/factsFAB'));
// const FactsDataGrid = React.lazy(() => import('../../Parts/ControlsERP/factsDataGrid'));
 
// const FactsExpansionPanel =React.lazy(() => import( '../../Parts/Controls/factsExpansionPanel'));
// const FactsSwipeList = React.lazy(() => import('../../Parts/Controls/factsSwipeList'));
// const FactsButton =React.lazy(() => import( '../../Parts/Controls/factsButton'));
// const FactsEntry = React.lazy(() => import('../../Parts/Controls/factsEntry'));                                     
// const FactsLabel  = React.lazy(() => import( '../../Parts/Controls/factsLabel'));
// const FactsIconButton  = React.lazy(() => import( '../../Parts/Controls/factsIconButton'));
// const FactsDatePicker  = React.lazy(() => import( '../../Parts/Controls/factsDatePicker'));
// const FactsLookup  = React.lazy(() => import( '../../Parts/Controls/factsLookup'));
// const FactsTimePicker  = React.lazy(() => import( '../../Parts/Controls/factsTimePicker'));
// const FactsDevList  = React.lazy(() => import( '../../Parts/Controls/factsDevList'));
// const FactsClickRecognizer  = React.lazy(() => import( '../../Parts/Controls/factsClickRecognizer'));
// const FactsFileButton  = React.lazy(() => import( '../../Parts/Controls/factsFileButton'));
// const FactsImage  = React.lazy(() => import( '../../Parts/Controls/factsImage'));
// const FactsAvatar  = React.lazy(() => import( '../../Parts/Controls/factsAvatar'));
// const FactsHidden  = React.lazy(() => import( '../../Parts/Controls/factsHidden'));
// const FactsERPChart = React.lazy(() => import( '../../Parts/ControlsERP/factsERPChart'));
// const FactsCanvas = React.lazy(() =>  import('../../Parts/Controls/factsCanvas'));
// const FactsExtraContent = React.lazy(() =>  import('../../Parts/Controls/factsExtraContent'));
// const FactsRenderer = React.lazy(() => import( '../../Parts/Controls/factsRenderer'));
// const FactsCheckbox = React.lazy(() =>  import('../../Parts/Controls/factsCheckbox'));
// const FactsFABMulti = React.lazy(() =>  import('../../Parts/Controls/factsFABMulti'));
// const FactsSection = React.lazy(() =>  import('../../Parts/Controls/factsSection'));
// const FactsTreeview = React.lazy(() =>  import('../../Parts/Controls/factsTreeview'));
// const FactsQRCode = React.lazy(() =>  import('../../Parts/Controls/factsQRCode'));
// const FactsBarCode = React.lazy(() =>  import('../../Parts/Controls/factsBarCode'));

class PureJSComponentFactory {

    scaffoldComponent(layout, refData = null, indexPrefix = "", scaffID = "") {
        let layoutArray = layout;
        if (typeof layout === "string") layoutArray = GetControlPropertyFromStoreOrRefData(layout, refData);

        if (layoutArray && Array.isArray(layoutArray)) {
            return (
                layoutArray.map(
                    (ctrl, index) => {
                        let newIndex = indexPrefix.toString() +  index.toString(); 
                        let currentCtrl =  ctrl; 
                        if (typeof ctrl === "string") currentCtrl = GetControlPropertyFromStoreOrRefData(ctrl, refData);

                    
                        let ctrlChildren = null;
                        if (currentCtrl?.chld) {

                            if (Array.isArray(currentCtrl.chld)) {
                                ctrlChildren = this.scaffoldComponent(currentCtrl.chld, refData, newIndex);
                            }
                            else if (typeof currentCtrl.chld === "string") {
                                ctrlChildren = GetControlPropertyFromStoreOrRefData(currentCtrl.chld, refData);

                                if (Array.isArray(ctrlChildren)) {
                                    ctrlChildren = this.scaffoldComponent(ctrlChildren, refData, newIndex);
                                }
                            }
                        }
                        if(!currentCtrl) return (<></>);
                        // let typeClassSplit = currentCtrl.type.split("$"); 
                        let controlType = this._getControlTypeFromKey( currentCtrl.type); //typeClassSplit[0]);
                        // let typeClass = typeClassSplit?.length > 1 ? typeClassSplit[1] : undefined; 
                        let resolvedProps = {};
                        if (currentCtrl.props && currentCtrl.props?.resolveprops) {
                            resolvedProps = {
                                // className : typeClass, 
                                 "resolveprops": undefined, ...getProcessedArgs(currentCtrl.props, refData, undefined, true), 
                                 ...currentCtrl.props.whenclick ? {"whenclick": currentCtrl.props.whenclick} : {}
                                }; //! Setting whenclick to original must be to avoid the processing of args inside it. But why? Why other events are not considered?? 
                        }

                        let styleProps = {};
                        if (currentCtrl.props?.style && currentCtrl.props?.resolvestyles) {
                            styleProps = { "resolvestyles": undefined, style: getProcessedArgs(currentCtrl.props.style, refData) };
                        }
                        // let ctrlProps = currentCtrl.props ? { key: index, ...currentCtrl.props, ...styleProps } : { key: index, ...styleProps };
                        let ctrlProps = {   key: `ctr${scaffID}${newIndex}` , ...currentCtrl.props, ...resolvedProps, ...styleProps };
                        if (ctrlProps.includerefdata) ctrlProps = { refData: refData, ...ctrlProps, "includerefdata": undefined };
                        return (React.createElement(controlType, ctrlProps, ctrlChildren)); 
                    }
                )
            );
        }
    }

    // _resolvestyles(styles, refData) { //TODO Need to refactor; Now using getProcessedArgs
    //     let newStyles = {};
    //     Object.keys(styles).forEach(t => {
    //         newStyles = {
    //             ...newStyles,
    //             [t]: GetControlPropertyFromStoreOrRefData(styles[t], refData)
    //         };

    //     });

    //     return newStyles;
    // }

    _getControlTypeFromKey(elementKey) {
        switch (elementKey.toLowerCase()) {
            //Charts
            case "echart": return (FactsERPChart);
            case "entry": return (FactsEntry);
            case "chbox": return (FactsCheckbox);
            case "dtpick": return (FactsDatePicker);
            case "tmpick": return (FactsTimePicker);
            case "lbl": return (FactsLabel);
            case "imgr": return (FactsImage);
            case "canv": return (FactsCanvas);
            // case "pdf": return (FactsPDFPreview);
            case "sect": return (FactsSection);
            case "ftbl": return (FactsDataGrid);
            case "expanel": return (FactsExpansionPanel);
            case "swplist": return (FactsSwipeList);
            case "btngroup": return (ButtonGroup);
            case "hide": return (FactsHidden);
            case "btn": return (FactsButton);
            case "filebtn": return (FactsFileButton);
            case "icbtn": return (FactsIconButton);
            case "fab": return (FactsFAB);
            case "mfab": return (FactsFABMulti);
            case "icon": return (Icon);
            case "ddl": return (FactsDropDown);
            case "lkup": return (FactsLookup);
            case "dxlist":  return (FactsDevList);
            case "dxgrid":  return (FactsDevGrid);
            case "vlist": return (FactsVirtualList);
            case "list": return (FactsList);
            case "click": return (FactsClickRecognizer);
            case "favatar": return (FactsAvatar);
            case 'xcnt': return (FactsExtraContent);
            case "render": return (FactsRenderer);
            case "tree": return (FactsTreeview);
            case "qrscan": return (FactsQRCode);
            case "bcscan": return (FactsBarCode);
            case "dxsched": return (FactsDevScheduler);
            case "view": return (FactsHTMLView);
            case "draw": return (FactsDraw);
            case "slider": return (FactsSlider);
            case "radio": return (FactsRadioGroup);
            case "drag": return (FactsDragSource);
            case "fragment": return (React.Fragment);
            case "tab": return (FactsTabControl);
            case "htmleditor": return (FactsHtmlEditor);
            case "chartpie": return (PieChartComponent);
            case "chartbar": return (BarChartComponent);
            case "chartarea": return (AreaChartComponent);
            case "chartline": return (LineChartComponent);
            case "dxdtpick": return (FactsDevDatePicker);
            case "dxlookup": return (FactsDevLookup);
            case "dxcircgauge": return (FactsDevCircularGauge);
            case "dxganttchart": return (FactsDevGanttChart);
            case "dxlingauge": return (FactsDevLinearGauge);
            case "dxbargauge": return (FactsDevBarGauge);
            case "dxnumberbox": return (FactsDevNumberBox);
            case "rsketch": return (FactsSketch);
            case "numlbl": return (FactsNumLabel);
            case "dxnumlbl": return (FactsDevNumberBoxLabel);
            case "barcodescan": return (FactsReactBarcode);
            case "zxingbarcode": return (FactsXzingBarcode);
            case "autocompletechip": return (FactsAutoCompleteChip);
            case "dxpivotgrid" : return (FactsDevPivotGrid);
            default: return elementKey;
        }

    }

}

export default PureJSComponentFactory; 