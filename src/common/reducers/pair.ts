import {
    SET_COMPARISON_READY,
    SET_PAIR_DATA,
    CLEAR_PAIR_DATA,
    COMPARISON_IN_PROCESS,
    SET_ROW_DATA1,
    SET_ROW_DATA2,
} from "../actions/actionTypes"
import { loadState } from "../store/sessionStorage"

let STATE = loadState('pair')
// let STATE: any;

if (!STATE) {
    STATE = {
        isComparisonResultReady: false,
        isComparisonInProcess: false,
        partner1: {
            encData: null,
            data: null,
            name: null,
        },
        partner2: {
            encData: null,
            data: null,
            name: null,
        },
    }
}

export type pairStoreType = typeof STATE

export const pair = (state = STATE, {
    type,
    isComparisonResultReady,
    isComparisonInProcess,
    data1,
    data2,
    encData1,
    encData2,
    name1,
    name2,
}: pairStoreType) => {
    switch (type) {
        case SET_COMPARISON_READY :
            return {
                ...state,
                isComparisonResultReady,
            }
        case COMPARISON_IN_PROCESS :
            return {
                ...state,
                isComparisonInProcess,
            }
        case SET_PAIR_DATA :
            return {
                ...state,
                partner1: {
                    ...state.partner1,
                    data: data1,
                    name: name1,
                },
                partner2: {
                    ...state.partner2,
                    data: data2,
                    name: name2,
                },
            }
        case SET_ROW_DATA1 :
            return {
                ...state,
                partner1: {
                    ...state.partner1,
                    encData: encData1
                },
            }
        case SET_ROW_DATA2 :
            return {
                ...state,
                partner2: {
                    ...state.partner2,
                    encData: encData2
                },
            }
        case CLEAR_PAIR_DATA :
            return {
                ...state,
                isComparisonResultReady: false,
                isComparisonInProcess: false,
                partner1: {
                    encData: null,
                    data: null,
                    name: null,
                },
                partner2: {
                    encData: null,
                    data: null,
                    name: null,
                },
            }
        default:
            return state
    }
}
