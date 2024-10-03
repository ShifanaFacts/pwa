import React, { Component } from "react";
import Button from "@mui/material/Button";
import { ExecuteLayoutEventMethods } from "../../../General/commonFunctions";
import { ShowSnackBar } from "../../../General/globalFunctions";

class FactsFileButton extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  ripOffControlSpecificAttributes() {
    const excluded = [
      "contentfield",
      "namefield",
      "sizefield",
      "typefield",
      "fileprops",
      "datatype",
      "controlid",
      "quality",
    ];
    return Object.keys(this.props)
      .filter((t) => !excluded.includes(t))
      .reduce((obj, key) => {
        obj[key] = this.props[key];
        return obj;
      }, {});
  }

  async handleButtonClick() {
    if (window.cordova && navigator.camera) {
      if (
        this.props?.fileprops?.capture === "environment" ||
        this.props?.fileprops?.capture === "user"
      ) {
        let cameraDirection =
          this.props?.fileprops?.capture === "environment" ? 0 : 1; // 0 FOR BACK, 1 FOR FRONT
        let destinationType = this.props.datatype === "base64" ? 0 : 1; // 0 for DATA_URI, 1 for FILE_URI
        let quality = (this.props?.quality ?? 0.2) * 100;
        let base64Prefix =
          destinationType === 0 ? "data:image/png;base64," : "";
        navigator.camera.getPicture(
          (imageData) => {
            try {
              this.mergeImageData(
                "CameraImage.jpg",
                imageData?.length,
                "jpg",
                base64Prefix + imageData
              );
            } catch (ex) {
              ShowSnackBar("error", ex);
            }
          },
          () => {
            ShowSnackBar("error", "Invalid Image!");
          },
          {
            cameraDirection,

            destinationType,
            quality,
            encodingType: 0, //JPG
            targetWidth: 500,
            correctOrientation: true,
          }
        );
        return;
      }
    }
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  }

  async handleOnChange(e) {
    const files = Array.from(this.inputRef.current.files);
    if (files.length === 0) return;

    for (const file of files) {
      const fileBase64 =
        this.props.datatype === "base64"
          ? await this.fileToBase64(file)
          : this.filetoBlob(file);
      if (fileBase64 instanceof Error) {
        ShowSnackBar("error", "Invalid File!");
        continue;
      }
      await this.mergeImageData(file?.name, file?.size, file?.type, fileBase64);
    }

    // Reset the input value to allow the same file selection
    if (this.inputRef.current) this.inputRef.current.value = null;
  }

  mergeImageData = async (fileName, fileSize, fileType, fileBase64) => {
    let dataToMerge = {};
    if (this.props.dset) {
      if (this.props.namefield)
        dataToMerge = { [this.props.namefield]: fileName };
      if (this.props.sizefield)
        dataToMerge = { ...dataToMerge, [this.props.sizefield]: fileSize };
      if (this.props.typefield)
        dataToMerge = { ...dataToMerge, [this.props.typefield]: fileType };
      if (this.props.contentfield)
        dataToMerge = {
          ...dataToMerge,
          [this.props.contentfield]: fileBase64,
        };
      if (this.props.versionfield)
        dataToMerge = {
          ...dataToMerge,
          [this.props.versionfield]: new Date().getTime(),
        };
      if (this.props.contentid)
        dataToMerge = { ...dataToMerge, [this.props.contentid]: "" };
      if (this.props.rowIndex)
        dataToMerge = { ...dataToMerge, [this.props.rowIndex]: -1 };
      await ExecuteLayoutEventMethods([
        {
          exec: "mergedataset",
          args: {
            dset: this.props.dset,
            data: dataToMerge,
          },
        },
      ]);
    }
    await ExecuteLayoutEventMethods(this.props.whenchange, dataToMerge);
  };

  filetoBlob = (file) => {
    return window.URL.createObjectURL(file);
  };

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      let appFileReader = new FileReader();

      appFileReader.readAsDataURL(file);
      appFileReader.onload = () => resolve(appFileReader.result);
      appFileReader.onerror = (error) => reject(error);
    });
  }

  render() {
    let newProps = this.ripOffControlSpecificAttributes();

    return (
      <>
        <Button
          className="factsFileButton"
          {...newProps}
          onClick={this.handleButtonClick.bind(this)}
        >
          {this.props.children}
        </Button>
        <input
          type="file"
          ref={this.inputRef}
          style={{ display: "none" }}
          multiple
          {...this.props.fileprops}
          onChange={(e) => this.handleOnChange(e)}
          onError={() => {
            alert("The Image is invalid!");
          }}
        />
      </>
    );
  }
}

export default FactsFileButton;
