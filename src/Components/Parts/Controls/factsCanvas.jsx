import React, { Component } from "react";
import { GetControlPropertyFromStoreOrRefData, ExecuteLayoutEventMethods } from "../../../General/commonFunctions";
// import store from "../../../AppRedux/store";
import { ownStore } from "../../../AppOwnState/ownState";

class FactsCanvas extends Component {
    constructor(props) {
        super(props);
        this.fileContentFromState = GetControlPropertyFromStoreOrRefData(props.src);
        this.fileVersion = GetControlPropertyFromStoreOrRefData(this.props?.version) ??  (new Date()).getTime();
        
        this.drawCanvas(this.fileContentFromState);
        // let disp = "inline"
        // if (!fileContentFromState && fileContentFromState === "") disp = "none";
        // let disp = "none"
        // if (this.fileContentFromState && this.fileContentFromState !== "") disp = "inline";
        // this.state = {
        //     isVisible: disp
        // };

    }

    ripOffControlSpecificAttributes() {

        const excluded = ["src", "staticimage", "bind"];
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
            this.unsubscribe = ownStore.subscribe((storeInfo) => {
                if (this.mounted) {
                    if(this.props?.src?.includes(storeInfo.dset)){ 
                    let newState = GetControlPropertyFromStoreOrRefData(this.props.src);

  
                    // this.setState({
                    //     fileContent: newState,
                    //     showImage: disp
                    // });
                    this.drawCanvas(newState);
                    // let disp = "none"
                    // if (newState && newState !== "") disp = "inline";

                    // this.setState({
                    //     isVisible: disp
                    // });
                    }

                }
            });
        }

    }

    drawCanvas(newState)  {
        var myCanvas = document.getElementById(this.props.id ?? 'factsAppCanvas');
        if (myCanvas) {
            // A FIX Below //* NOTE *//
            //* If we compare the content of file to trigger whenchange event, adding same file from input may not work
            //* If we dont check, the whenchange will trigger for any redux change.
            //* We cannot compare the redux dataset name too, since the canvas may mutate the same dataset, so it will end up in loop
            //* So we implement a versioning mechanism. It will collect the version number from dataset (typically dset.fileVersion from filebtn)
            //* If the version is not null, it will check if version is different 
            //* Either the data should be different or the or it should be different version
            //* So that we can prevent whenchange event looping on every redux change 

            let fVer =  GetControlPropertyFromStoreOrRefData(this.props?.version);
            let isSameVersion =  true; 
             if(fVer && fVer !== this.fileVersion ){ 
                this.fileVersion = fVer; 
                isSameVersion = false; 
            }
            if (newState !== this.fileContentFromState || (fVer && !isSameVersion)) {
                myCanvas.style.display = "none";

                this.fileContentFromState = newState;


                var img = new Image();

                img.onload = async function () {

                    var ctx = myCanvas.getContext('2d');

                    let isImageProportional = this.props.autorotate ?  (img.height >= img.width) : true; 
                    myCanvas.width = img.width;//myCanvas.parentNode?.clientWidth;
                    myCanvas.height = myCanvas.width *
                        (isImageProportional ? (img.height / img.width)
                            : (img.width / img.height));

                    // ctx.translate(myCanvas.height / 2, myCanvas.width / 2); //let's translate
                    if (!isImageProportional) {
                        ctx.translate(myCanvas.width / 2, myCanvas.height / 2);
                        ctx.rotate((Math.PI / 180) * 90);
                        ctx.translate(-myCanvas.height / 2, -myCanvas.width / 2);
                    }
                    ctx.drawImage(img, 0, 0,
                        isImageProportional ? myCanvas.width : myCanvas.height,
                        isImageProportional ? myCanvas.height : myCanvas.width,
                    ); // Or at whatever offset you like
                    let imageData = myCanvas.toDataURL(this.props.filetype, this.props.quality); 
                    if (this.props.dset && this.props.bind) {
                       await ExecuteLayoutEventMethods([

                            {
                                exec: "setdatasetfield",
                                args: {
                                    dset: this.props.dset,
                                    fieldname: this.props.bind,
                                    data: imageData
                                }
                            }
                        ]);
                    }
                    await ExecuteLayoutEventMethods(this.props.whenchange,imageData );

                    window.URL.revokeObjectURL(newState);
                    img = null;
                    myCanvas.style.display = "inline";
                }.bind(this);
                img.src = newState;

            }
            //test
        }



    }



    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
        this.mounted = false;

    }


    render() {
        let newProps = this.ripOffControlSpecificAttributes();
        return (
            // <img src={this.state.fileContent} alt="Stateful Graphic" {...newProps} style={{ display: this.state.showImage, ...newProps?.style }} />
            <canvas className="factsCanvas" id="factsAppCanvas"   {...newProps}  ></canvas>
        );
    }
}

export default FactsCanvas; 