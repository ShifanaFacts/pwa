import {createStore } from 'redux'; 
import pageDsReducer from './pageDs/pageDsReducer';
 


// const rootReducer = combineReducers({
//     pageds: pageDsReducer
// })


const store = createStore(pageDsReducer); 

export default store; 