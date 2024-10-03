import {
    STORE_DATASET, STORE_DATASET_FIELD,
    STORE_USER, AUTH_LOGIN, AUTH_LOGOUT, SHOW_APP_BUSY, HIDE_APP_BUSY, MERGE_OBJECT_DATASET, MERGE_ARRAY_DATASET
} from './pageDsActionTypes';

export const storeDataset = (payload) => {
    return {
        type: STORE_DATASET,
        payload: payload
    }
}

export const mergeObjectDataset = (payload) => {
    return {
        type: MERGE_OBJECT_DATASET,
        payload: payload
    }
}

export const mergeArrayDataset = (payload) => {
    return {
        type: MERGE_ARRAY_DATASET,
        payload: payload
    }
}


export const storeDatasetField = (payload) => {
    return {
        type: STORE_DATASET_FIELD,
        payload: payload
    }
}


//Login && User below

export const storeUser = (payload) => {
    return {
        type: STORE_USER,
        payload: payload
    }
}


export const authLogin = () => {
    return {
        type: AUTH_LOGIN
    }
}

export const authLogout = () => {
    return {
        type: AUTH_LOGOUT
    }
}

export const showAppBusy = () => {
    return {
        type: SHOW_APP_BUSY
    }
}

export const hideAppBusy = () => {
    return {
        type: HIDE_APP_BUSY
    }
}
