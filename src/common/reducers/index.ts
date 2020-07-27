import {combineReducers} from 'redux';
import {userData} from "./user-data-reducer";
import {termsReducer} from "./terms-reducer";
import {pairCoopReducer} from "./pair-coop-reducer";
import {teamCoopReducer} from "./team-coop-reducer";

const rootReducer = combineReducers({
    pairCoopReducer,
    teamCoopReducer,
    userData,
    termsReducer
});

export default rootReducer;