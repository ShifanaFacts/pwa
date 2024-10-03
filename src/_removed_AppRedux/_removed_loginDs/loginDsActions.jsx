import { STORE_USER, AUTH_LOGIN, AUTH_LOGOUT, SHOW_APP_BUSY, HIDE_APP_BUSY } from './loginDsActionTypes';

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