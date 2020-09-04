import {
    LOADING,
    SET_ERROR,
    PROCESS_FAILED, SEND_EMAIL, CHANGE_PWD
} from "../actions/actionTypes"

const APP = {
    isLoading: false,
    errorApiMessage: null,
    processFailed: false,
    emailSent: false,
    isPwdChanged: false
}

export type AppReducerType = {
    type: string
    isLoading: boolean
    errorApiMessage: '' | null
    processFailed: boolean
    emailSent: boolean
    isPwdChanged: boolean
}

export const appReducer = (state = APP, {
    type,
    isLoading,
    errorApiMessage,
    processFailed,
    emailSent,
    isPwdChanged
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
        case SEND_EMAIL :
            return {
                ...state,
                emailSent
            };
        case CHANGE_PWD :
            return {
                ...state,
                isPwdChanged
            };
        default:
            return state
    }
}