import {FETCH_TERMS} from "../actions/actionTypes";
import {loadState} from "../store/sessionStorage";

let PSYCHO = loadState('psychology');

if (!PSYCHO) {
    PSYCHO = {
        terms: null
    }
}

export type TermsReducerType = {
    type: string
    terms: null | {}
};

export const termsReducer = (state = PSYCHO, {
    type,
    terms,
}: TermsReducerType) => {
    switch (type) {
        case FETCH_TERMS :
            return {
               ...state,
               terms,
            }
        default:
            return state
    }
}