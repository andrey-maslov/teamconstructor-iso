import {
    T_COMPARISON_IN_PROCESS,
    T_SET_COMPARISON_READY,
    SET_TEAMS_DATA,
    SET_ACTIVE_TEAM

} from "../actions/actionTypes";
import {loadState} from "../store/sessionStorage";

let STATE = loadState('team');

if (!STATE) {
    STATE = {
        type: '',
        isComparisonResultReady: false,
        isComparisonInProcess: false,
        teams: [],
        activeTeam: 0
    }
}

type teamCoopReducerType = typeof STATE;

export const teamCoopReducer = (state = STATE, {
    type,
    isComparisonResultReady,
    isComparisonInProcess,
    teams,
    activeTeam,
}: any) => {
    switch (type) {
        case T_SET_COMPARISON_READY :
            return {
                ...state,
                isComparisonResultReady,
            };
        case T_COMPARISON_IN_PROCESS :
            return {
                ...state,
                isComparisonInProcess,
            };
        case SET_TEAMS_DATA :
            return {
                ...state,
                teams
            }
        case SET_ACTIVE_TEAM :
            return {
                ...state,
                activeTeam
            }
        default:
            return state;
    }
};