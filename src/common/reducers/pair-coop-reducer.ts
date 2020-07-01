import {
    SET_COMPARISON_READY,
    SET_USERS_RESULTS,
    CLEAR_USERS_RESULTS,
    COMPARE_PROCESS,
    SET_ROW_DATA1,
    SET_ROW_DATA2,
} from "../actions/actionTypes";
import {loadState} from "../store/sessionStorage";

let STATE = loadState('pair');

if (!STATE) {
    STATE = {
        type: '',
        isComparisonResultReady: false,
        isComparisonInProcess: false,
        user1: {
            rowData: '',
            data: [],
            name: '',
        },
        user2: {
            rowData: '',
            data: [],
            name: '',
        },
    }
}

type pairCoopReducerType = typeof STATE;

export const pairCoopReducer = (state = STATE, {
    type,
    isComparisonResultReady,
    isComparisonInProcess,
    userData1,
    userData2,
    rowData1,
    rowData2,
    name1,
    name2,
}: any) => {
    switch (type) {
        case SET_COMPARISON_READY :
            return {
                ...state,
                isComparisonResultReady,
            };
        case COMPARE_PROCESS :
            return {
                ...state,
                isComparisonInProcess,
            };
        case SET_USERS_RESULTS :
            return {
                ...state,
                user1: {
                    ...state.user1,
                    data: userData1,
                    name: name1,
                },
                user2: {
                    ...state.user2,
                    data: userData2,
                    name: name2,
                },
            };
        case SET_ROW_DATA1 :
            return {
                ...state,
                user1: {
                    ...state.user1,
                    rowData: rowData1
                },
            };
        case SET_ROW_DATA2 :
            return {
                ...state,
                user2: {
                    ...state.user2,
                    rowData: rowData2
                },
            };
        case CLEAR_USERS_RESULTS :
            return {
                ...state,
                isComparisonResultReady: false,
                user1: {
                    rowData: '',
                    data: [],
                    name: ''
                },
                user2: {
                    rowData: '',
                    data: [],
                    name: ''
                },
            };
        default:
            return state;
    }
};