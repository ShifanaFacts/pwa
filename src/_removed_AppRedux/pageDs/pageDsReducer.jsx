import {
    STORE_DATASET, STORE_DATASET_FIELD, MERGE_OBJECT_DATASET, MERGE_ARRAY_DATASET,
    STORE_USER, AUTH_LOGIN, AUTH_LOGOUT,
    SHOW_APP_BUSY, HIDE_APP_BUSY
} from "./pageDsActionTypes";

const initialState = {
};

const pageDsReducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_DATASET:
            return {
                ...state,
                [action.payload.dataSetName]: action.payload.data
            };
        case MERGE_OBJECT_DATASET:
            return {
                ...state,
                [action.payload.dataSetName]: { ...state[action.payload.dataSetName], ...action.payload.data }
            };
        case MERGE_ARRAY_DATASET:
            let replaceIndex = (action.payload.index != null && action.payload.index >= 0) ? action.payload.index : undefined;
            let returnDset  = {}; 
            if( action.payload.mode === "updatecol" )
            {
                let returnArray = []; 
                for(let arObj of state[action.payload.dataSetName]){
                    returnArray.push({...arObj, ...action.payload.data}); 
                }
                returnDset = {[action.payload.dataSetName]: returnArray}; 
                
            }
            else
            { 
                let item = (replaceIndex >= 0 && replaceIndex < state[action.payload.dataSetName].length ? state[action.payload.dataSetName][replaceIndex]: {});
                item = action.payload.data ? {...item, ...action.payload.data} : undefined; 
                if(item){ //If item is not null, its an edit or add 
                    returnDset =   {[action.payload.dataSetName]: [...state[action.payload.dataSetName].slice(0, replaceIndex), item,
                        ...(replaceIndex != undefined ? state[action.payload.dataSetName].slice(replaceIndex + 1) : [])]};
                }
                else{ //if data specified is null its supposed to be a delete
                    returnDset =   {[action.payload.dataSetName]: [...state[action.payload.dataSetName].slice(0, replaceIndex), 
                        ...(replaceIndex != undefined ? state[action.payload.dataSetName].slice(replaceIndex + 1) : [])]};
                }
            }
            
            let returnState =  {
                ...state,
                ...returnDset
            };
            return returnState;
        case STORE_DATASET_FIELD:
            let fieldDataset = { ...state[action.payload.dataSetName], [action.payload.fieldName]: action.payload.data };
            if (!action.payload.data)
                delete fieldDataset[action.payload.fieldName];

            return {
                ...state,
                [action.payload.dataSetName]: fieldDataset
            };
        //Login && User Details Below
        case AUTH_LOGIN:
            return {
                ...state,
                "login": {
                    ...state["login"],
                    isAuthenticated: true
                }
            };
        case AUTH_LOGOUT:
            return {
                "login": {
                    isAuthenticated: false
                }
            };
        case SHOW_APP_BUSY:
            return {
                ...state,
                "login": {
                    ...state["login"],
                    isAppBusy: true
                }
            };
        case HIDE_APP_BUSY:
            return {
                ...state,
                "login": {
                    ...state["login"],
                    isAppBusy: false
                }
            };
        case STORE_USER:
            return {
                ...state,
                "login": {
                    ...state["login"],
                    details: action.payload
                }
            };

        default: return state;

    }
}

export default pageDsReducer; 