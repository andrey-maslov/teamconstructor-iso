import {
    LOADING,
    SET_ERROR,
    PROCESS_FAILED
} from "../actions/actionTypes"


const APP = {
    isLoading: false,
    errorApiMessage: null,
    processFailed: false
}


export type AppReducerType = {
    type: string
    isLoading: boolean
    errorApiMessage: '' | null
    processFailed: boolean
}

export const appReducer = (state = APP, {
    type,
    isLoading,
    errorApiMessage,
    processFailed
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
                errorApiMessage
            };
        case PROCESS_FAILED :
            return {
                ...state,
                processFailed
            };
        default:
            return state
    }
}