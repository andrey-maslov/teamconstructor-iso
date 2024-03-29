import { FETCH_CONTENT, FETCH_TERMS } from "../actions/actionTypes"
import { loadState } from "../store/sessionStorage"

const PSYCHO = {
    terms: null,
    descriptions: null,
}

export type TermsStoreType = typeof PSYCHO

export const terms = (state = PSYCHO, {
    type,
    terms,
    descriptions,
}: any) => {
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