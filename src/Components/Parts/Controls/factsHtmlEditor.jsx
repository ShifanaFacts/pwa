import React, { Component } from "react";
import { ExecuteLayoutEventMethods, GetControlPropertyFromStoreOrRefData } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
// import HtmlEditor, {
//     Toolbar, MediaResizing, ImageUpload, Item,
//   } from 'devextreme-react/html-editor';  
import { ownStore } from "../../../AppOwnState/ownState";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import 'devextreme/dist/css/dx.common.css';
// import 'devextreme/dist/css/dx.light.css';


// const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
// const fontValues = [
//   "Arial",
//   "Courier New",
//   "Georgia",
//   "Impact",
//   "Lucida Console",
//   "Tahoma",
//   "Times New Roman",
//   "Verdana"
// ];
// const headerValues = [false, 1, 2, 3, 4, 5];



class FactsHtmlEditor extends Component {

    constructor(props) {
        super(props);
        this.rowIndex = GetControlPropertyFromStoreOrRefData(props.rowindex, props.refData) ?? "";

        let textValueFromState = props.initialvalue;

        if (this.props.dset && this.props.bind) {
            textValueFromState = GetControlPropertyFromStoreOrRefData("[" + props.dset + "." +
                (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                + props.bind + "]", props.refData);
        }
        this.state = {
            textValue: (textValueFromState === null ? "" : textValueFromState)
        }
        this.finalValue = (textValueFromState === null ? "" : textValueFromState);

        // this.valueChanged = this.valueChanged.bind(this);
   
    }

    

    componentDidMount() {
        this.mounted = true;
        this.unsubscribe = ownStore.subscribe((storeInfo) => {
            if (this.mounted) {
                if ([storeInfo.dset, "raw"].includes(this.props.dset) &&
                    (storeInfo.field ?? this.props.bind) === this.props.bind) {

                    if (this.props.dset && this.props.bind) {
                        let newState = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." +
                            (this.rowIndex === "" ? "" : (this.rowIndex + "."))
                            + this.props.bind + "]", this.props.refData);

                        if (this.finalValue !== newState) {

                            if (newState === null) newState = "";
                            this.finalValue = newState;

                            this.setState({
                                textValue: this.finalValue
                            });

                        }
                    }
                }
            }
        });

    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }

    // bindingEscapeValue(val) {  //?Escaping handled at ExecuteEventArgs by sending args noprocess as true; Check above code
    //     if ( val?.startsWith && val.startsWith("[") && val.endsWith("]")) return " " + val + " "; //Added to escape texts which mimics inner binding
    //     else
    //         return val;
    // }
    
    async saveCurrentTextToDataset() {

        this.finalValue = this.state.textValue;

        if (this.props.dset && this.props.bind) {
            if (this.rowIndex !== "") {
                let rowData = GetControlPropertyFromStoreOrRefData("[" + this.props.dset + "." + this.rowIndex + "]", this.props.refData);

                await ExecuteLayoutEventMethods([
                    {
                        exec: "mergedatasetarray",
                        args: {
                            noprocess: true,
                            dset: this.props.dset,
                            index: parseInt(this.rowIndex),
                            data:
                            {
                                ...rowData,
                                [this.props.bind]: this.state.textValue
                            }
                        }
                    }]);
            }
            else {
                await ExecuteLayoutEventMethods([

                    {
                        exec: "setdatasetfield",
                        args: {
                            noprocess: true,
                            dset: this.props.dset,
                            fieldname: this.props.bind,
                            data: this.state.textValue
                        }
                    }
                ]);
            }
        }
    }
  
    // valueChanged(e) {
    //     this.setState({
    //         textValue: e.value,
    //     }, async () => {
    //         // this.isBlurDirty = true;
    //         await this.saveCurrentTextToDataset();
    //          // this.isBlurDirty = false;
    //     });
    //   }
    
    // handleOnFocus(e) {
    //     e.preventDefault();
    //     const { target } = e;

    //     target.select();
    // }
   
    handleOnReady(e) {
        // console.log("Ready Function defined here ",e)
    }  

    // ripOffControlSpecificAttributes() {
    //     const excluded = ["resolveprops", "acceptTab", "format", "refData", "rowindex"];
    //     return (
    //         Object.keys(this.props)
    //             .filter((t) => !excluded.includes(t))
    //             .reduce((obj, key) => {
    //                 obj[key] = this.props[key];
    //                 return obj;
    //             }, {}));

    // }
   
    render() {
        // let newProps = this.ripOffControlSpecificAttributes();      
                return (
                    // <HtmlEditor  {...newProps} defaultValue={this.state.textValue}
                    //     onValueChanged={this.valueChanged}

                    //     onFocus={(e) => this.handleOnFocus(e)}>
                     
                    //     <Toolbar multiline={true}>
                    //     <Item name="undo" />
                    //     <Item name="redo" />
                    //     <Item name="separator" />
                    //     <Item
                    //       name="size"
                    //       acceptedValues={sizeValues}
                    //     />
                    //     <Item
                    //       name="font"
                    //       acceptedValues={fontValues}
                    //     />
                    //     <Item name="separator" />
                    //     <Item name="bold" />
                    //     <Item name="italic" />
                    //     <Item name="strike" />
                    //     <Item name="underline" />
                    //     <Item name="separator" />
                    //     <Item name="alignLeft" />
                    //     <Item name="alignCenter" />
                    //     <Item name="alignRight" />
                    //     <Item name="alignJustify" />
                    //     <Item name="separator" />
                    //     <Item name="color" />
                    //     <Item name="background" />
                    //   </Toolbar>
                    //   </HtmlEditor>
                    <CKEditor
                    className="factsHtmlEditor"
                    editor={ ClassicEditor }
                    data={this.state.textValue}
                    onReady={this.handleOnReady}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.setState({
                            textValue: data,
                        }, async () => {
                            await this.saveCurrentTextToDataset();
                        });
                        // console.log("Changed value is ", this.state.textValue)
                    } }                 
                />
                );

    }
}

export default FactsHtmlEditor;