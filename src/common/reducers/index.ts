import {combineReducers} from 'redux';
import {userData} from "./user-data-reducer";
import {modalsReducer} from "./modals-reducer";
import {termsReducer} from "./terms-reducer";
import {compareReducer} from "./compare-reducer";

const rootReducer = combineReducers({
    compareReducer,
    userData,
    modalsReducer,
    termsReducer
});

export default rootReducer;