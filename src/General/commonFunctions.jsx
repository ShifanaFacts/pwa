// import store from "../AppRedux/store";
import { storeDataset, storeDatasetField } from "../AppOwnState";
import { pageServiceInstance, authServiceInstance, userMenuStorageKey, apiRoot } from "./globals";
import { mergeObjectDataset, mergeArrayDataset, showAppBusy, hideAppBusy } from "../AppOwnState/ownStateActions";
import { startOfToday } from "date-fns";
import { endOfToday } from "date-fns/esm";
import { funcs, dyadicFuncExecutor, IFTRUE, IFFALSE } from "./funcExecutor";
import { GPSLocation, ShowAppMenu, ShowAppNotification, ShowDialog, ShowSnackBar } from "./globalFunctions";
import StorageService from "../Services/storageService";
import deepmerge from "deepmerge";
import { ownStore } from "../AppOwnState/ownState";

export async function _loadProcDataToDataSet(serverDataset, eventInfo, callBackFunction, refData) {

    if (serverDataset && eventInfo) {
        if (eventInfo.ignoreempty &&
            (typeof serverDataset.length !== "undefined") &&
            serverDataset.length <= 0) return;
        let dataSetName = GetControlPropertyFromStoreOrRefData(eventInfo.dset, refData);
        if (dataSetName) {
            if (eventInfo.column && serverDataset?.length > 0) { //Select JSON Data stored in a Column in Dataset; Check the PopupLayout Info Scaffold JSON; It returns the whole dataset; But we need only JSON stored in layoutinfo column
                let columnValue = serverDataset[eventInfo?.row ?? 0][eventInfo.column];
                if (!columnValue) return;
                try {
                    if (dataSetName === "popupinfo") { //if its [lastpopup] change it to popupname (Because we really cant attach popup identifying information to every event inside layout For eg. Button click cannot know the popup button belongs to )
                        columnValue = columnValue.replaceAll("[lastpopup]", eventInfo.section);
                    }
                    if(eventInfo.nojsonparse) serverDataset = columnValue;
                    else serverDataset = JSON.parse(columnValue);
                }
                catch {
                    return;
                }
            }
            if (typeof eventInfo.row !== undefined && serverDataset.length > eventInfo.row) {
                let rowValue = serverDataset[eventInfo.row];
                serverDataset = rowValue;
            }
            let storeDataSet = ownStore.getState(dataSetName);
            let currentDataSet = storeDataSet;
            if (eventInfo.section && currentDataSet) currentDataSet = currentDataSet[eventInfo.section];    //If section name is provided in event consider it as object of multiple datasets; usually for popups
            // let
            //  dstr1 = JSON.stringify(currentDataSet),
            // dstr2 = JSON.stringify(serverDataset);  //Removed => Just to compare the exisiting Redux Object and new Object; Why shuld we change state if no changes

            // if (dstr1 !== dstr2) {
            if (eventInfo.section) {
                if (dataSetName === "local") {
                    let dstr2 = JSON.stringify(serverDataset);
                    localStorage.setItem(eventInfo.section, dstr2);
                }
                else if (dataSetName === "session") {
                    let dstr2 = JSON.stringify(serverDataset);
                    sessionStorage.setItem(eventInfo.section, dstr2);
                }
                else {
                    if (dataSetName === "popupinfo") {
                        // if(serverDataset ) serverDataset.popupid = eventInfo.section; //Just add the section name as popupid for filtering of popups in lastpopup resolution section
                        window.history.pushState({}, window.location.hash);//If a new popup added, just add a history to enable back click
                    }
                    ownStore.dispatch(storeDataset( //Redux
                        {
                            dataSetName: dataSetName,
                            data: { ...storeDataSet, ...{ [eventInfo.section]: serverDataset } }
                        }
                    ));
                }
            }
            else {

                ownStore.dispatch(storeDataset( //Redux
                    {
                        dataSetName: dataSetName,
                        data: serverDataset
                    }
                ));
            }
            //}

            if (callBackFunction) callBackFunction(serverDataset);
        }

    }
}

export function SetCreateDataSet(dataInfo, dataObject, refData) {
    if (dataInfo) {
        let dataSetName = GetControlPropertyFromStoreOrRefData(dataInfo.dset, refData);
        ownStore.dispatch(storeDataset( //Redux
            {
                dataSetName: dataSetName,
                data: dataObject
            }
        ));
    }
}

export function MergeDataSet(dataInfo, dataObject, refData) {
    if (dataInfo) {
        let dataSetName = GetControlPropertyFromStoreOrRefData(dataInfo.dset, refData);
        ownStore.dispatch(mergeObjectDataset( //Redux
            {
                dataSetName: dataSetName,
                data: dataObject
            }
        ));
    }
}

export function DeepMergeDataSet(dataInfo, sourceObject, dataObject, refData) {
    if (dataInfo) {
        dataObject = dataObject ?? {};
        let dataSetName = GetControlPropertyFromStoreOrRefData(dataInfo.dset, refData);
        let mergedObject = deepmerge((sourceObject ?? {}), dataObject,
            { arrayMerge: (destinationArray, sourceArray, options) => sourceArray }
        );
        ownStore.dispatch(storeDataset( //Redux
            {
                dataSetName: dataSetName,
                data: mergedObject
            }
        ));
    }
}

export function MergeDataSetArray(dataInfo, dataObject, index, mode, refData) {
    if (dataInfo) {
        let dataSetName = GetControlPropertyFromStoreOrRefData(dataInfo.dset, refData);

        ownStore.dispatch(mergeArrayDataset( //Redux
            {
                dataSetName: dataSetName,
                data: dataObject,
                index: index,
                mode: mode
            }
        ));
    }
}

export function SetCreateDataSetField(dataInfo, refData) {
    if (dataInfo) {
        let dataSetName = GetControlPropertyFromStoreOrRefData(dataInfo.dset, refData);

        let originalData = dataInfo.data;
        let fieldName = dataInfo.fieldname;
        let keepField = dataInfo.keepfield; //added keepfield to pass onto condition
        if (dataInfo.fieldname?.includes(".")) {    //Handling deep value changing
            let fieldArrays = dataInfo.fieldname.split(".");
            if (fieldArrays.length > 0) {
                originalData = ownStore.getState(dataSetName)[fieldArrays[0]];
                originalData = JSON.stringify(originalData); //To prevent direct mutation to the Redux
                originalData = JSON.parse(originalData); //To prevent direct mutation to the Redux
                // if (Array.isArray(originalData))
                //     originalData = [...[], ...originalData];
                // else
                //     originalData = { ...{}, ...originalData };
                let deepValue = originalData;
                let i = 1;
                for (; i < fieldArrays.length - 1; i++) {
                    if (!deepValue[fieldArrays[i]]) { //To create a new property if the property not existing; Used when deep assigning
                        deepValue[fieldArrays[i]] = {}; //!Only object properties can be created for now
                    }
                    deepValue = deepValue[fieldArrays[i]];
                }
                fieldName = fieldArrays[0];

                deepValue[fieldArrays[i]] = dataInfo.data;
                //added !dataInfo.keepfield condition to it to consider keepfield=true
                if (!dataInfo.keepfield && dataInfo.data == null) { 
                    if (Array.isArray(deepValue))
                        deepValue.splice(fieldArrays[i], 1);
                    else
                        delete deepValue[fieldArrays[i]];
                }
            }
        }

        ownStore.dispatch(storeDatasetField( //Redux
            {
                dataSetName: dataSetName,
                fieldName: fieldName,
                data: originalData,
                keepfield : keepField  //added keepfield to pass on to the function
            }
        ));
    }
}

export function objectMatchAll(dataset, verifyArgs, satisfy, stringComparison = "equals", stringIgnoreCase = false) { //Verify single Object value pairs against another single Object and returns true if all property values match 
    let assertedMatches = [];
    if (verifyArgs) {
        Object.keys(verifyArgs).forEach(item => {
            let firstValue = GetControlPropertyFromStoreOrRefData(item, dataset);
            let secondValue = GetControlPropertyFromStoreOrRefData(verifyArgs[item], dataset);
            if (stringIgnoreCase === true) {
                // firstValue = (firstValue ?? "").toLowerCase();
                // secondValue = (secondValue ?? "").toLowerCase();
                // firstValue = JSON.stringify(firstValue).toLowerCase();
                // secondValue = JSON.stringify(secondValue).toLowerCase();
                if (typeof firstValue != "number") {
                  firstValue = (firstValue ?? "").toLowerCase();
                }
                if (typeof secondValue != "number") {
                  secondValue = (secondValue ?? "").toLowerCase();
                }
            }
            assertedMatches.push(
                stringComparison === "contains" ?
                    (JSON.stringify(firstValue)?.includes(secondValue))
                    : (firstValue === secondValue)
            );
        });
    }
    let isAllMatched =
        satisfy === "any" ? assertedMatches.some(t => t === true)
            : assertedMatches.every(t => t === true);
    return isAllMatched;
}

async function verifyDatasetAgainstMultipleValues(dataset, verifyArgs) {

    let isMatchedException = objectMatchAll(dataset, { "[this.type]": "FactsInternalException" }, "any");

    if (isMatchedException) {
        ShowSnackBar("error", dataset?.description ?? "Some unknown error happened!")
        return true;
    }

    let shouldHaltExecution = false;

    let isAllMatched = objectMatchAll(dataset, verifyArgs?.ref, verifyArgs?.satisfy);

    if (isAllMatched && verifyArgs?.whenmatch) {
        
      if (verifyArgs?.halton === "match") shouldHaltExecution = true;
      await ExecuteLayoutEventMethods(verifyArgs?.whenmatch, dataset);
    }
    if (!isAllMatched && verifyArgs?.whenunmatch) {
      
      if (verifyArgs?.halton === "unmatch") shouldHaltExecution = true;
      await ExecuteLayoutEventMethods(verifyArgs?.whenunmatch, dataset);
    }
    return shouldHaltExecution;

}

function getProcessedArgsWithGeoLocation(args, refData, noDeepProcess) {
    let mProcessedArgs = getProcessedArgs(
        {
            geolat: "[local.devloc.lat]",
            geolong: "[local.devloc.long]",
            ...args
        }
        , refData, noDeepProcess);
    return mProcessedArgs;
}
export async function dsFiller(dataPoint, refData, result_type) {
    if (pageServiceInstance) {
        let procName = GetControlPropertyFromStoreOrRefData(dataPoint?.args?.proc, refData);

        let resolvedArgs = GetControlPropertyFromStoreOrRefData(dataPoint?.args?.args, refData);

        let sProcessedArgs = getProcessedArgsWithGeoLocation(resolvedArgs, refData, dataPoint?.args?.nodeepprocess);
        let controllerName = GetControlPropertyFromStoreOrRefData(dataPoint?.args?.controller, refData);
        if (!controllerName) controllerName = "proc";
        //Offline Access
        let offlineAccess = dataPoint?.args?.offline;
        //Offline Access
        let sServerDataSet = await pageServiceInstance.loadData(procName, sProcessedArgs, result_type, controllerName, offlineAccess);

        if (await verifyDatasetAgainstMultipleValues(sServerDataSet, dataPoint?.args?.verify)) {
            ownStore.dispatch(hideAppBusy());
            return "FactsError";
        }
        return sServerDataSet;
    }
    return undefined;
}
export async function ExecuteLayoutEventMethods(eventData, refData, callBackFunction = null, secondaryCall = false) {
    let eData = GetControlPropertyFromStoreOrRefData(eventData, refData);
    if (typeof eData == "string") eData = JSON.parse(eData);
    if (eData) {
        // store.dispatch(showAppBusy());

        if (eData[0]?.exec !== "hideloader" && (!secondaryCall)) ownStore.dispatch(showAppBusy());

        for (let dataPoint of eData) {
            dataPoint = GetControlPropertyFromStoreOrRefData(dataPoint, refData);
            if (Array.isArray(dataPoint)) {
              if (await ExecuteLayoutEventMethods(dataPoint, refData, null, true) === "HALT") {
                   return "HALT";
               }
                // for (let childDPoint of dataPoint) {
                //     if (await executeEventDataPoint(childDPoint, refData, callBackFunction) === "HALT") {
                //         return;
                //     }
                // }
            }
            else {
                if (await executeEventDataPoint(dataPoint, refData, callBackFunction) === "HALT") {
                    // if (eData[0]?.exec !== "hideloader" && (!secondaryCall)) ownStore.dispatch(hideAppBusy());
                    return "HALT";
                }

            }
        }
        if (eData[0]?.exec !== "hideloader" &&  //If the event section starts with no loader, no need to hide it
            eData[0]?.exec !== "showloader" &&  //If loader is shown explicitely, User needs to hide it manually
            (!secondaryCall)) ownStore.dispatch(hideAppBusy()); //If the call  comes from internally, Ofcourse there is no loader

    }

}

async function executeEventDataPoint(dataPoint, refData, callBackFunction) {
    switch (dataPoint?.exec) {
      case "filldataset":
        let sServerDataSet = await dsFiller(dataPoint, refData);
        if (typeof sServerDataSet !== "undefined") {
          if (sServerDataSet === "FactsError") return "HALT";
          let fillDsArgs = getProcessedDynamic(dataPoint?.args, refData);
          if (dataPoint?.args?.argsdset)
            //if argsdset is specified store the args to that dataset; JFF :D
            SetCreateDataSet(
              { dset: dataPoint?.args?.argsdset },
              dataPoint?.args?.noprocessargsdset
                ? dataPoint?.args?.args
                : fillDsArgs?.args,
              refData
            );

          await _loadProcDataToDataSet(
            sServerDataSet,
            fillDsArgs,
            callBackFunction,
            refData
          );
        }
        break;
      case "fillreport":
        let rServerDataSet = await dsFiller(dataPoint, refData, "report");
        if (typeof rServerDataSet !== "undefined") {
          if (rServerDataSet === "FactsError") return "HALT";
          let fillFileArgs = getProcessedDynamic(dataPoint?.args, refData);
          await _loadProcDataToDataSet(
            rServerDataSet,
            fillFileArgs,
            callBackFunction,
            refData
          );
        }
        break;
      case "excelupload":
      case "exceltemplate":
      case "filedownload":
        let eServerDataSet = await dsFiller(
          dataPoint,
          refData,
          dataPoint?.exec
        );
        if (typeof eServerDataSet !== "undefined") {
          if (eServerDataSet === "FactsError") return "HALT";
          let fillRptArgs = getProcessedDynamic(dataPoint?.args, refData);
          await _loadProcDataToDataSet(
            eServerDataSet,
            fillRptArgs,
            callBackFunction,
            refData
          );
        }
        break;
      case "fillmultidataset":
        // if (pageServiceInstance) {
        // let mProcessedArgs = getProcessedArgsWithGeoLocation(dataPoint?.args?.args, refData);
        // let mServerDataset = await pageServiceInstance.loadData(dataPoint?.args?.proc, mProcessedArgs, "multi");

        // if (verifyDatasetAgainstMultipleValues(mServerDataset, dataPoint?.args?.verify)) {
        //     store.dispatch(hideAppBusy());
        //     return;
        // }
        let mServerDataset = await dsFiller(dataPoint, refData, "multi");
        if (mServerDataset) {
          if (mServerDataset === "FactsError") return "HALT";
          for (let mdset of dataPoint?.args?.dsets ?? []) {
            let fillMDsArgs = getProcessedDynamic(mdset, refData);
            await _loadProcDataToDataSet(
              mServerDataset[mdset?.table],
              {
                dset: fillMDsArgs?.name,
                proc: dataPoint?.args?.proc,
                column: fillMDsArgs?.column,
                row: fillMDsArgs?.row,
                section: fillMDsArgs?.section,
              },
              callBackFunction,
              refData
            );
          }
        }
        break;
      case "setdataset":
        // store.dispatch(showAppBusy());
        let sdsName = GetControlPropertyFromStoreOrRefData(
          dataPoint?.args?.dset,
          refData
        );
        let processedArgsData = getProcessedDynamic(
          dataPoint?.args?.data,
          refData,
          dataPoint?.args?.nodeepprocess
        );

        SetCreateDataSet(
          { ...dataPoint?.args, dset: sdsName },
          processedArgsData,
          refData
        );
        // store.dispatch(hideAppBusy());
        break;
      case "invalidate":
        // store.dispatch(showAppBusy());
        for (let nds of dataPoint?.args?.datasets) {
          SetCreateDataSet({ dset: nds }, null);
        }
        // store.dispatch(hideAppBusy());
        break;
      case "setlocal":
        // store.dispatch(showAppBusy());
        let processedArgsDataLocal = getProcessedDynamic(
          dataPoint?.args?.data,
          refData
        );
        let lKeyName = GetControlPropertyFromStoreOrRefData(
          dataPoint?.args?.key,
          refData
        );

        localStorage.setItem(lKeyName, JSON.stringify(processedArgsDataLocal));
        // store.dispatch(hideAppBusy());
        break;
      case "mergedataset":
        // store.dispatch(showAppBusy());
        let keyProcessedData = dataPoint?.args?.data;

        if (dataPoint?.args?.resolvekeys) {
          keyProcessedData = processObjectKeys(keyProcessedData, refData);
        }

        let processedArgsData2 = dataPoint?.args?.noprocess
          ? keyProcessedData
          : getProcessedDynamic(keyProcessedData, refData);
        MergeDataSet(dataPoint?.args, processedArgsData2, refData);
        // store.dispatch(hideAppBusy());
        break;
      case "deepmergedataset":
        // store.dispatch(showAppBusy());
        let processedArgsDataSourceDeep = getProcessedDynamic(
          dataPoint?.args?.data1,
          refData
        );
        let processedArgsDataDeep = getProcessedDynamic(
          dataPoint?.args?.data2,
          refData
        );
        DeepMergeDataSet(
          dataPoint?.args,
          processedArgsDataSourceDeep,
          processedArgsDataDeep,
          refData
        );
        // store.dispatch(hideAppBusy());
        break;
      case "setdatasetfield":
        let processedArgsData3 = dataPoint?.args?.noprocess
          ? dataPoint?.args
          : getProcessedArgs(dataPoint?.args, refData);

        SetCreateDataSetField(processedArgsData3, refData);
        break;
      case "mergedatasetarray":
        // store.dispatch(showAppBusy());.
        let processedArgsData4 = getProcessedDynamic(
          dataPoint?.args?.data,
          refData
        );
        if (dataPoint?.args?.resolvekeys) {
          processedArgsData4 = processObjectKeys(processedArgsData4, refData);
        }
        let curInde = GetControlPropertyFromStoreOrRefData(
          dataPoint?.args?.index,
          refData
        );

        MergeDataSetArray(
          dataPoint?.args,
          processedArgsData4,
          curInde,
          dataPoint?.args?.mode,
          refData
        );
        // store.dispatch(hideAppBusy());
        break;
      case "validatedataset":
        if (
          await verifyDatasetAgainstMultipleValues(refData, dataPoint?.verify)
        ) {
          ownStore.dispatch(hideAppBusy());
          return "HALT";
        }
        break;
      case "haltwhen":
        let verifyArgs = {
          satisfy: "all",
          ref: {
            [dataPoint?.args?.input]: dataPoint?.args?.haltwhen,
          },
        };
        var haltWhenResult = objectMatchAll(
          refData,
          verifyArgs?.ref,
          verifyArgs?.satisfy
        );
        if (haltWhenResult) {
          let messageToShow = GetControlPropertyFromStoreOrRefData(
            dataPoint?.args?.errormessage,
            refData
          );
          ShowSnackBar("error", messageToShow);
          ownStore.dispatch(hideAppBusy());
          return "HALT";
        }
        break;
      case "exitwhen":
        let exitData = GetControlPropertyFromStoreOrRefData(
          dataPoint?.input,
          refData
        );
        if (exitData) {
          ownStore.dispatch(hideAppBusy());
          return "HALT";
        }
        break;
      case "logout":
        authServiceInstance.logout();
        break;
      case "showloader":
        ownStore.dispatch(showAppBusy());
        break;
      case "hideloader":
        ownStore.dispatch(hideAppBusy());
        break;
      case "showpopup": //Helper function for LoadPopup
        await executeEventDataPoint({
          exec: "filldataset",
          args: {
            dset: "popupinfo",
            proc: dataPoint?.args?.proc ?? "PWA.LoadLayout",
            column: dataPoint?.args?.column ?? "layoutinfo",
            section: dataPoint?.args?.section,
            args: {
              doctype: dataPoint?.args?.doctype,
              docno: dataPoint?.args?.docno,
            },
          },
        });
        break;
      case "directfileupload":
        if (pageServiceInstance) {
          let eServerDataSet = await pageServiceInstance.uploadFile(refData);
          if (typeof eServerDataSet !== "undefined") {
            if (eServerDataSet === "FactsError") return "HALT";
            let fillRptArgs = getProcessedDynamic(dataPoint?.args, refData);
            await _loadProcDataToDataSet(
              eServerDataSet,
              fillRptArgs,
              callBackFunction,
              refData
            );
          }
          if (await verifyDatasetAgainstMultipleValues(eServerDataSet, dataPoint?.args?.verify)) {
            ownStore.dispatch(hideAppBusy());
            return "FactsError";
        }
        }
        break;
      case "showdialog":
        let processedDialogData = getProcessedDynamic(
          dataPoint?.args,
          refData,
          false
        );

        let dialBtn1Prop = processedDialogData?.btn1
          ? {
              chld: processedDialogData?.btn1,
              props: {
                ...processedDialogData?.btn1props,
                whenclick: processedDialogData?.btn1whenclick,
              },
            }
          : undefined;
        let dialBtn2Prop = processedDialogData?.btn2
          ? {
              chld: processedDialogData?.btn2,
              props: {
                ...processedDialogData?.btn2props,
                whenclick: processedDialogData?.btn2whenclick,
              },
            }
          : undefined;
        ShowDialog(
          processedDialogData?.title,
          processedDialogData?.description,
          dialBtn1Prop,
          dialBtn2Prop
        );
        break;
      case "showmenu":
        let menuItems = dataPoint?.args?.items;

        if (typeof dataPoint?.args?.items === "string")
          menuItems = GetControlPropertyFromStoreOrRefData(
            dataPoint?.args?.items,
            refData
          );
        //else
        if (!dataPoint?.args?.nodeepprocess && Array.isArray(menuItems))
          menuItems = getProcessedArray(menuItems, refData);
        menuItems &&
          ShowAppMenu(
            refData?.controlid,
            menuItems,
            dataPoint?.args?.layout,
            dataPoint?.args?.title,
            refData
          );
        break;
      case "showsnackbar":
        let snackArgs = getProcessedDynamic(dataPoint?.args, refData);

        ShowSnackBar(snackArgs?.type, snackArgs?.message);
        break;
      case "shownotification":
        ShowAppNotification(dataPoint?.args);
        break;
      case "eval":
        let evalJS = dataPoint?.js;
        if (dataPoint?.args) {
          let evalArgs = getProcessedDynamic(dataPoint?.args, refData);
          evalArgs &&
            Object.keys(evalArgs).forEach((key) => {
              evalJS = evalJS?.replaceAll(key, evalArgs[key]);
            });
        }
        eval(evalJS);
        break;
      case "alert":
        let alertData = getProcessedDynamic(dataPoint?.input, refData);
        alert(JSON.stringify(alertData));
        break;
      case "confirm":
         let showConfirm = objectMatchAll(
           refData,
           dataPoint?.args?.showon?.ref,
           dataPoint?.args?.showon?.satisfy
         );
          if(showConfirm){
                let confirmValue = window.confirm(dataPoint?.args?.message); //Show message and get true on OK false on cancel
                let shouldHaltonTrue = dataPoint?.args?.halton === "OK"; //CHecks if halton is set OK inside args
                if (confirmValue) {
                  //if user pressed ok
                  if (shouldHaltonTrue) {
                    //check if the above halton prop is set OK, then halt or leave it
                    ownStore.dispatch(hideAppBusy());
                    return "HALT";
                  }
                } else {
                  //If user pressed cancel
                  if (!shouldHaltonTrue) {
                    //check if the above halton prop is set other than OK, then halt or leave it
                    ownStore.dispatch(hideAppBusy());
                    return "HALT";
                  }
                }
            }
        break;
      case "debuglog":
        let logData = getProcessedDynamic(dataPoint?.input, refData);
        console.log(logData);
        break;
      case "collectgeo":
        await GPSLocation(dataPoint?.args);
        break;
      case "logtime":
        console.log(dataPoint?.prefix + " " + Date().toLocaleString());
        break;
      case "downloadbase64":
        let downloadB64Args = getProcessedDynamic(dataPoint?.args, refData);
        downloadBase64File(downloadB64Args);
        break;
      case "downloadfile":
        let downloadArgs = getProcessedDynamic(dataPoint?.args, refData);
        let link = document.createElement("a");
        link.setAttribute("href", downloadArgs?.prefix + downloadArgs.filedata);
        link.setAttribute("download", downloadArgs?.filename);
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
        break;
      case "continuelogin":
        authServiceInstance.continueLogin();
        break;
      case "navigate":
        var menuInfo = getProcessedDynamic(dataPoint?.args, refData);
        window.history.pushState({}, "", "#/" + (menuInfo?.permalink ?? ""));
        await ExecuteLayoutEventMethods(
          [
            {
              exec: "setdataset",
              args: {
                dset: "pagemenuinfo",
                data: menuInfo,
              },
            },
          ],
          null,
          null,
          true
        );
        await ExecuteLayoutEventMethods(menuInfo?.action, null, null, true);
        break;
      // case "showpopup":
      //     await ExecuteLayoutEventMethods(
      //         [
      //             {
      //                 "exec": "filldataset",
      //                 "args": {
      //                     "proc": "PWA.LoadLayout",
      //                     "column": "layoutinfo",
      //                     "dset": "popupinfo",
      //                     "section": dataPoint?.args?.section,
      //                     "args": {
      //                         "doctype": dataPoint?.args?.doctype,
      //                         "docno": dataPoint?.args?.docno
      //                     }
      //                 }
      //             }
      //         ]);
      //     break;
      default:
    }
    return "";
}


const downloadBase64File = ({ prefix, filename, filedata }) => {
  if (filedata) {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isChrome =
      navigator.userAgent.toLowerCase().indexOf("CriOS") > -1 ||
      navigator.vendor.toLowerCase().indexOf("google") > -1;
    var iOSVersion = [];
    if (iOS) {
      iOSVersion = navigator.userAgent
        .match(/OS [\d_]+/i)[0]
        .substr(3)
        .split("_")
        .map((n) => parseInt(n));
    }
    var attachmentData = filedata;
    var attachmentName = filename;
    var contentType = prefix ?? "application/pdf";

    var binary = atob(attachmentData.replace(/\s/g, ""));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    var linkElement = document.createElement("a");
    try {
      var hrefUrl = "";
      var blob = "";
      if (iOS && !isChrome && iOSVersion[0] <= 12) {
        blob = `data:${contentType};base64,` + filedata;
        hrefUrl = blob;
      } else {
        if (iOS && !isChrome) {
          contentType = "application/octet-stream";
        }
        blob = new Blob([view], { type: contentType });
        hrefUrl = window.URL.createObjectURL(blob);
      }
      linkElement.setAttribute("href", hrefUrl);
      linkElement.setAttribute("target", "_blank");
      if ((iOS && (iOSVersion[0] > 12 || isChrome)) || !iOS) {
        linkElement.setAttribute("download", attachmentName);
      }
      var clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: false,
      });
      linkElement.dispatchEvent(clickEvent);
    } catch (ex) {}
  }
};


function processObjectKeys(data, refData) {
    let processedData = {};
    Object.keys(data).forEach(key => {
        let prKey = GetControlPropertyFromStoreOrRefData(key, refData);
        processedData = { ...processedData, [prKey]: data[key] };
    });
    return processedData;
}
export function getProcessedDynamic(args, refData, noDeepProcessing, fromRenderer) {
    if (Array.isArray(args)) return getProcessedArray(args, refData, noDeepProcessing, fromRenderer);
    else if (typeof args === "object") return getProcessedArgs(args, refData, noDeepProcessing, fromRenderer);
    else return GetControlPropertyFromStoreOrRefData(args, refData);
}

export function getProcessedArgs(args, refData, noDeepProcessing, fromRenderer) {
    if (!args) return null;
    if (args instanceof Date) return args;
    let processedArgs = {};

    let argsToProcess = GetControlPropertyFromStoreOrRefData(args, refData);
    if (!noDeepProcessing && argsToProcess && typeof argsToProcess === "object") {
        if (!(argsToProcess?.noinitialprocess && fromRenderer)) {
            Object.keys(argsToProcess).forEach(item => {
                if (typeof argsToProcess[item] === "string")
                    processedArgs = { ...processedArgs, ...{ [item]: GetControlPropertyFromStoreOrRefData(argsToProcess[item], refData) } };
                else if (Array.isArray(argsToProcess[item]))
                    processedArgs = { ...processedArgs, ...{ [item]: getProcessedArray(argsToProcess[item], refData, undefined, fromRenderer) } };
                else if (typeof argsToProcess[item] === "object")
                    processedArgs = { ...processedArgs, ...{ [item]: getProcessedArgs(argsToProcess[item], refData, undefined, fromRenderer) } };
                else
                    processedArgs = { ...processedArgs, ...{ [item]: argsToProcess[item] } };

            });
            return processedArgs;

        }
    }
    return argsToProcess;
}

function getProcessedArray(args, refData, noDeepProcessing, fromRenderer) {
    let processedArgs = [];
    if (!args) return null;
    if (!args.forEach) return args;
    if (noDeepProcessing) return args;
    args.forEach(item => {
        if (typeof item === "string")
            processedArgs = [...processedArgs, GetControlPropertyFromStoreOrRefData(item, refData)];
        else if (typeof item === "object") //Todo: Need to consider Array Later
            processedArgs = [...processedArgs, getProcessedArgs(item, refData, undefined, fromRenderer)];
        else
            processedArgs = [...processedArgs, item];
    });
    return processedArgs;

}

export function GetControlPropertyFromStoreOrRefData(propertyString, refData = null) { //To resolve  property in bracket to select from Redux State Property
    let currentState = propertyString;
    if (propertyString && propertyString.startsWith && propertyString.startsWith("[") && propertyString.endsWith("]")) {
        // propertyString = propertyString.replace(" ", "")
        // let prop = propertyString.replace("[", "").replace("]", "")
        let prop = propertyString.slice(1, propertyString.length - 1);
        if (prop) {
            prop = _resolveInnerBinding(prop, refData);
            let funcDetails = [];

            funcs.forEach(t => {
                let currentFuncIndex = 0;
                do {
                    currentFuncIndex = prop.indexOf(t, currentFuncIndex + 1);
                    if (currentFuncIndex > 0) {
                        funcDetails.push({ "index": currentFuncIndex, "oper": t });
                    }
                } while (currentFuncIndex > 0);
            });

            funcDetails = funcDetails.sort((a, b) => a.index - b.index).map((t, index) => {
                return { ...t, "index": index }
            });

            // let funcDetails = funcs.map((t) => {

            //     return { "index": prop.indexOf(t), "oper": t };
            // }).filter(t => t.index > 0).sort(t => t.index).map((t, index) => {
            //     return { ...t, "index": index }
            // });
            if (funcDetails.length > 0) { //Bind string contains a  Formula, Find it and process them
                // let propToSplit = "";
                funcDetails.forEach(t => {
                    prop = prop.split(t.oper).join("*^*");
                });
                let propList = prop.split("*^*");

                let aggregate = _getBindData(propList[0], currentState, refData);
                let haveCondition = false;
                for (let i = 0; i < funcDetails.length; i++) {
                    let t = funcDetails[i];
                    let secondValue = _getBindData(propList[t.index + 1], currentState, refData);
                    if (t.oper === IFTRUE) { //iftrue function
                        if (aggregate === true) { //If the value upto here results to => true
                            aggregate = secondValue;    //Set the second value as the value; That's the result
                            haveCondition = true;   //Setting this to true to prevent (iffalse) to execute
                        }
                        else { //If the aggregate is not true 
                            i = funcDetails.findIndex((t, j) => j > i && t.oper === IFFALSE);  //Finding the next iffalse function index that comes after the current ifftrue function (This is to prevent considering the secondValue of iftrue function)
                            if (i < 0) break; //if the iffalse function is not found; i.e., the index is -1, just break the loop
                            else i--;  //if the iffalse function is found, minus 1 to make sure the iffalse function will be executed
                        }

                    }
                    else if (t.oper === IFFALSE) { //iffalse function
                        if (haveCondition) break; //if the iftrue condition is already satisfied, no need to execute the iffalse function
                        if (aggregate === false) aggregate = secondValue; //if the aggregate value is false, take the secondValue as result

                    }
                    else aggregate = dyadicFuncExecutor(t.oper, aggregate, secondValue); //Do the other functions
                }
                currentState = aggregate;

            }
            else { //Binding string doesnt have formula, so just process it
                currentState = _getBindData(prop, currentState, refData);
            }
        }
    }

    if (currentState === undefined) currentState = null;
    return currentState;
}

// function _resolveInnerBinding(prop, refData) {
//     let innerBindStart = prop.indexOf("[");
//     let innerBindEnd = prop.indexOf("]", innerBindStart+ 1);
//     if (innerBindStart >= 0 && innerBindEnd > innerBindStart) {
//         let innerBind = prop.slice(innerBindStart, innerBindEnd + 1);
//         let bindData = GetControlPropertyFromStoreOrRefData(innerBind, refData);
//         prop = prop.replace(innerBind, bindData);
//         prop =  _resolveInnerBinding(prop, refData); 
//     }
//     return prop;
// }
function _resolveInnerBinding(prop, refData) { //?Redesigned to support deep inner binding
    let sampler = [];
    let pSplits = prop.split("");
    for (let i = 0; i < pSplits.length; i++) {
        if (pSplits[i] === "[") sampler.push(i);
        if (pSplits[i] === "]") {
            let innerBindStart = sampler.pop()
            let innerBindEnd = i + 1;
            if (innerBindStart >= 0 && innerBindEnd > innerBindStart) {
                let innerBind = prop.slice(innerBindStart, innerBindEnd);
                let bindData = GetControlPropertyFromStoreOrRefData(innerBind, refData);
                prop = prop.replace(innerBind, bindData);
                prop = _resolveInnerBinding(prop, refData); //recursion and break necessary to prevent indexes being changed; Only one inner binding can be handled by one function calll

                break;
            }
        }
    }



    return prop;
}
function _getBindData(prop, currentState, refData) {

    let propArray = prop.split(".");
    let dataMode = "state";

    switch (propArray[0]) {
        case "this":  //If binding string start from this, use RefData i.e, local data send by the request
            currentState = refData;
            break;
        case "func": break;  //If binding string is a value function, no need to get the state data, it will be calculate in following lines
        case "local": //get localStorage data(Treat JSON Parse)
            if (propArray.length > 1) {
                currentState = localStorage[propArray[1]] && JSON.parse(localStorage[propArray[1]]);
                propArray[1] = "local";
            }
            break;
        case "session": //get sessionStorage data (Treat JSON Parse)
            if (propArray.length > 1) {
                currentState = JSON.parse(sessionStorage[propArray[1]]);
                propArray[1] = "session";
            }
            break;
        case "serviceurl":
            propArray[1] = "serviceurl";
            currentState = apiRoot;
            break;
        case "lastpopup":
            propArray[1] = "lastpopup";
            currentState = getLastPopupKey();
            break;
        case "url": //get url routes
            if (propArray.length > 1) {
                let urlArray = window.location.hash.split("/");
                let urlChunkIndex = parseInt(propArray[1]);
                if (urlChunkIndex) {
                    currentState = urlArray[urlChunkIndex];
                    propArray[1] = "url";
                }
            }
            else
                currentState = window.location.href;
            break;
        case "raw":   //Raw Text
            dataMode = "raw";
            propArray.shift(); //Rejoin the string excluding the raw keyword and return it
            currentState = propArray.join(".").replace("{chrdot}", ".");
            break; //If this is raw string no need to get a state, instead it will be processed by the loop
        default: //All other, get state from Redux state
            currentState = getReduxState();

    }
    // if (propArray[0] !== "func") { //The binding is not from a Value function (like today)
    //     currentState = propArray[0] === "this" ? refData : store.getState();
    // }
    if (dataMode !== "raw") {
        for (let propItem of propArray) {
            if (propItem === "this" || propItem === "local" || propItem === "session" ||
                propItem === "url" || propItem === "serviceurl" || propItem === "lastpopup") continue; //If binding string starts with a pointer, just ignore the first section
            if (propItem === 'func') {
                dataMode = 'func';
                continue;
            }

            else if (dataMode === "func") {
                currentState = _getFuncValue(propItem);
                break;
            }
            else if (propItem && currentState) {
                currentState = currentState[propItem];
            }
        }
    }
    return currentState;
}


function getReduxState() {
    return ownStore.getFullState(); //To CHECK
}

export function _getFuncValue(propItem) {
    switch (propItem) {
        case "null": return null;
        case "true": return true;
        case "false": return false;
        case "undefined": return undefined;
        case "emptystring": return "";

        case "today":
            return new Date();
        case "todaystarttime":
            var dt = startOfToday()
            return dt;
        case "todayendtime":
            var dt1 = endOfToday()
            return dt1;
        case "emptyarray":
            return [];
        case "emptyobject":
            return {};
        case "screensize":
            let iW = window.innerWidth; 
            // if(iW <576) return "xs"; 
            if(iW <768) return "sm"; 
            if(iW <992) return "md"; 
            // if(iW <1200) return "lg"; 
            // if(iW <1400) return "xl"; 
            return "lg";

        default:
            return null;
    }
}


export function ChangePageDataSetState(datasets) {  //Join Redux States to single object; To avoid calling local setState multiple times; Currently implemented in  factsTaskList component
    if (!datasets) return null;
    let dstate = {};
    for (let dset of datasets) {
        dstate = { ...dstate, ...{ [dset]: ownStore.getState(dset) } };
    }
    return dstate;
}

function getLastPopupKey() {
    let pInfo = ownStore.getState("popupinfo");
    if (pInfo) return Object.keys(pInfo).pop();
    return null;
}

export async function RemoveLastDialog(e) {
    let pInfo = ownStore.getState("popupinfo");
    if (pInfo) {
        let lastKey = Object.keys(pInfo).pop();
        if (lastKey) {
            if (pInfo[lastKey].appbar?.whenbackclick) {
                await ExecuteLayoutEventMethods(pInfo[lastKey].appbar?.whenbackclick);
            }
            else {
                await ExecuteLayoutEventMethods(
                    [
                        {
                            "exec": "setdatasetfield",
                            "args": {
                                "dset": "popupinfo",
                                "fieldname": lastKey,
                                "data": null
                            }
                        }]);
            }
            return;
        }
    }
    // alert(e.currentTarget.location.hash)

    handleRouting(e.currentTarget.location.hash.split("/")[1]);

}

export async function handleRouting(docNoFromRoute) { //Repeated from AuthorizedCOmponent due to logic change

    let currentPageInfo = ownStore.getState("pageinfo");
    if (currentPageInfo?.whenbackbutton) {
        // await ExecuteLayoutEventMethods([{
        //     "exec": "setdataset",
        //     "args": {
        //         "dset": "pageinfo",
        //         "data": currentPageInfo
        //     }
        // }]);

        window.history.pushState({}, '')
        await ExecuteLayoutEventMethods(currentPageInfo?.whenbackbutton);
        return;
    }

    let userMenu = new StorageService().getJsonValue(userMenuStorageKey);
    userMenu = userMenu?.map(t => {
        let actionObj = JSON.parse(t.action);
        t.action = actionObj;
        return t;
    });

    let pageToShow = userMenu?.filter(t => docNoFromRoute === t.permalink);
    if (pageToShow?.length <= 0) {
        pageToShow = userMenu?.filter(t => t.homepage && t.homepage.toLowerCase() === "true");
        window.history.pushState({}, '') //Note: Commented to check Back button not exiting issue
    }
    if (pageToShow?.length > 0) {
        // alert(JSON.stringify(pageToShow[0]?.action));
        // window.location.hash = "#" + pageToShow[0]?.permalink;
        await ExecuteLayoutEventMethods([{
            "exec": "setdataset",
            "args": {
                "dset": "pagemenuinfo",
                "data": pageToShow[0]
            }
        }]);
        await ExecuteLayoutEventMethods(pageToShow[0]?.action);
    }

}