import {FETCH_CONTENT, FETCH_TERMS, LOADING, SET_ERROR} from "../actions/actionTypes"


const APP = {
    isLoading: false,
    errorMessage: null,
}


export type AppReducerType = {
    type: string
    isLoading: boolean
    errorMessage: '' | null
}

export const appReducer = (state = APP, {
    type,
    isLoading,
    errorMessage,
}: AppReducerType) => {
    switch (type) {
        case LOADING :
            return {
                ...state,
                isLoading,
            }
        case SET_ERROR :
            return {
                ...state,
                errorMessage
            };
        default:
            return state
    }
}