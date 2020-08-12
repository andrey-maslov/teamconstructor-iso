import {FETCH_CONTENT, FETCH_TERMS} from "../actions/actionTypes";
import {loadState} from "../store/sessionStorage";

let PSYCHO = loadState('psychology');

if (!PSYCHO) {
    PSYCHO = {
        terms: null,
        descriptions: null,
    }
}

export type TermsReducerType = {
    type: string
    terms: null | any
    descriptions: null | any
};

export const termsReducer = (state = PSYCHO, {
    type,
    terms,
    descriptions,
}: TermsReducerType) => {
    switch (type) {
        case FETCH_TERMS :
            return {
               ...state,
               terms,
            }
        case FETCH_CONTENT :
            return {
                ...state,
                descriptions
            }
        default:
            return state
    }
}