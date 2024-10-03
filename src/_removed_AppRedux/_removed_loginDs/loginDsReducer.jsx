import { STORE_USER, AUTH_LOGIN, AUTH_LOGOUT, SHOW_APP_BUSY, HIDE_APP_BUSY } from "./loginDsActionTypes";

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    details: {}
};

const loginDsReducer = (state = initialState, action) => {
    switch(action.type){
        case AUTH_LOGIN: 
            return {
                ...state,
                isAuthenticated: true
            };     
        case AUTH_LOGOUT: 
            return {
                ...state,
                isAuthenticated: false
            };     
        case SHOW_APP_BUSY: 
            return {
                ...state,
                isAppBusy: true
            };  
        case HIDE_APP_BUSY: 
            return {
                ...state,
                isAppBusy: false
            };  
        case STORE_USER: 
            return {
                ...state, 
                details: action.payload
            };             
        default: return state; 

    }
}

export default loginDsReducer; 