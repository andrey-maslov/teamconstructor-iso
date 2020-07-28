import {combineReducers} from 'redux';
import {userData} from "./user-data-reducer";
import {termsReducer} from "./terms-reducer";
import {pairCoopReducer} from "./pair-coop-reducer";
import {teamCoopReducer} from "./team-coop-reducer";
import {modalsReducer} from "./modals-reducer";

const rootReducer = combineReducers({
    pairCoopReducer,
    teamCoopReducer,
    userData,
    termsReducer,
    modalsReducer,
});

export default rootReducer;