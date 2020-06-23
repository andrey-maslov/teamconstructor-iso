import {
    SET_COMPARISON_READY,
    SET_USERS_RESULTS,
    CLEAR_USERS_RESULTS,
} from "../actions/actionTypes";
import {loadState} from "../store/sessionStorage";

let STATE = loadState('compare');

if (!STATE) {
    STATE = {
        type: '',
        isComparisonResultReady: false,
        user1: {
            data: [],
        },
        user2: {
            data: [],
        },
    }
}

// const STATE = {
//     type: '',
//     isComparisonResultReady: false,
//     user1: {
//         data: [],
//     },
//     user2: {
//         data: [],
//     },
// };

type compareReducerType = typeof STATE;

export const compareReducer = (state = STATE, {
    type,
    isComparisonResultReady,
    userData1,
    userData2,
}: any) => {
    switch (type) {
        case SET_COMPARISON_READY :
            return {
                ...state,
                isComparisonResultReady,
            };
        case SET_USERS_RESULTS :
            return {
                ...state,
                user1: {
                    data: userData1
                },
                user2: {
                    data: userData2
                },
            };
        case CLEAR_USERS_RESULTS :
            return {
                ...state,
                isComparisonResultReady: false,
                user1: {
                    data: []
                },
                user2: {
                    data: []
                },
            };
        default:
            return state;
    }
};