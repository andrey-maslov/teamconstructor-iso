import {combineReducers} from 'redux';
import {userData} from "./user-data-reducer";
import {modalsReducer} from "./modals-reducer";
import {termsReducer} from "./terms-reducer";
import {pairCoopReducer} from "./pair-coop-reducer";

const rootReducer = combineReducers({
    pairCoopReducer,
    userData,
    modalsReducer,
    termsReducer
});

export default rootReducer;