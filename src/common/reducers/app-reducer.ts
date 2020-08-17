import {FETCH_CONTENT, FETCH_TERMS, LOADING} from "../actions/actionTypes"


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
        default:
            return state
    }
}