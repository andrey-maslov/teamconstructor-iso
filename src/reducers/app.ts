import {
    LOADING,
    SET_ERROR,
    PROCESS_FAILED, SEND_EMAIL, CHANGE_PWD
} from "../actions/actionTypes"

const APP = {
    isLoading: false,
    errorApiMessage: null,
    setToast: null,
    processFailed: false,
    emailSent: null,
    isPwdChanged: null
}

export type appStoreType = {
    type: string
    isLoading: boolean
    setToast: number | null
    errorApiMessage: '' | null
    processFailed: boolean
    emailSent: boolean | null
    isPwdChanged: boolean | null
}

export const app = (state = APP, {
    type,
    isLoading,
    errorApiMessage,
    processFailed,
    emailSent,
    isPwdChanged
}: appStoreType) => {
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
            }
        case PROCESS_FAILED :
            return {
                ...state,
                processFailed
            }
        case SEND_EMAIL :
            return {
                ...state,
                emailSent
            }
        case CHANGE_PWD :
            return {
                ...state,
                isPwdChanged
            }
        default:
            return state
    }
}