import {
    AUTH_LOGIN, AUTH_LOGOUT, HIDE_APP_BUSY, MERGE_ARRAY_DATASET, MERGE_OBJECT_DATASET,
    SHOW_APP_BUSY,
    STORE_DATASET, STORE_DATASET_FIELD, STORE_USER
} from "../AppOwnState/ownStateActionTypes";
import {  getUniqueID } from "../General/globals";
import { ownObject } from "./ownObjectStore";

class OwnState {
    constructor() {
        this.callBackFunctions = [];
    }

    subscribe(callBackFn) {
        let fnKey = getUniqueID();
        let callBakObj = { key: fnKey, fn: callBackFn }
        this.callBackFunctions.push(callBakObj);
        return () => { this.callBackFunctions = this.callBackFunctions.filter((obj) => obj.key !== fnKey) };
    }
    getState(dsetName) {
        return ownObject.getDataSet(dsetName);
    }

    getFullState() {
        return ownObject.getFullDataSet();
    }

    dispatch(action) {
        if (action && action.type) {
            let actionDSetName = action?.payload?.dataSetName;
            switch (action.type) {
                case STORE_DATASET:
                    if (action.payload.dataSetName) ownObject.storeDataSet(action.payload);
                    break;
                case MERGE_OBJECT_DATASET:
                    if (action.payload.dataSetName) ownObject.mergeDataSet(action.payload);
                    break;
                case MERGE_ARRAY_DATASET:
                    if (action.payload.dataSetName) ownObject.mergeDataSetArray(action.payload);
                    break;
                case STORE_DATASET_FIELD:
                    if (action.payload.dataSetName && action.payload.fieldName) ownObject.storeDataSetField(action.payload);
                    break;
                case AUTH_LOGIN:
                    ownObject.storeDataSet({
                        dataSetName: "login",
                        data: { isAuthenticated: true }
                    });
                    actionDSetName = "login";
                    break;
                case AUTH_LOGOUT:
                    ownObject.storeDataSet({
                        dataSetName: "login",
                        data: { isAuthenticated: false }
                    });
                    actionDSetName = "login";
                    break;
                case SHOW_APP_BUSY:
                    ownObject.storeDataSet({
                        dataSetName: "isAppBusy",
                        data: true
                    });
                    actionDSetName = "isAppBusy";
                    break;
                case HIDE_APP_BUSY:
                    ownObject.storeDataSet({
                        dataSetName: "isAppBusy",
                        data: false
                    });
                    actionDSetName = "isAppBusy";
                    break;
                case STORE_USER: //Not used 
                    ownObject.storeDataSet({
                        dataSetName: "_userinfo",
                        data: action.payload.data
                    });
                    actionDSetName = "_userinfo";
                    break;
                default: break;
            }
            // if (debugstate) {
            //     if (window.debugstateds) {
            //         if (window.debugstateds === action?.payload?.dataSetName ||
            //             window.debugstateds === "*") {
            //             console.log("%c ▼▼▼", "color:magenta;");
            //             console.log(`%c ${action?.type} ${action?.payload?.dataSetName ? "on " + action.payload.dataSetName : ""}`, "background-color:#9c27b0;color:white;");
            //             console.log(action, "►►►", ownObject);
            //         }

            //     }
            //     if (window.debugstatefn) {
            //         console.log("%c ▼▼▼", "color:magenta;");
            //         console.log(action, "►►►", this.callBackFunctions);
            //     }
            // }
            this.callBackFunctions.forEach(fnObj => fnObj &&
                fnObj.fn({ dset: actionDSetName, index: action.payload?.index, field: action.payload?.fieldName }));
        }

    }
}

export const ownStore = new OwnState(); 
