import {
    LOADING,
    SET_ERROR,
    PROCESS_FAILED,
    SEND_EMAIL,
    CHANGE_PWD, SET_AUTH_ERROR, REDIRECT_URL
} from "../actions/actionTypes"

const APP = {
    isLoading: false,
    errorApiMessage: null,
    accountApiErrorMsg: null,
    redirectUrl: null,
    setToast: null,
    processFailed: false,
    isEmailSent: false,
    isPwdChanged: false
}

export type appStoreType = {
    type: string
    isLoading: boolean
    setToast: number | null
    errorApiMessage: '' | null
    accountApiErrorMsg: string | null
    redirectUrl: string | null
    processFailed: boolean
    isEmailSent: boolean
    isPwdChanged: boolean
}

export const app = (state = APP, {
    type,
    isLoading,
    errorApiMessage,
    processFailed,
    isEmailSent,
    isPwdChanged,
    accountApiErrorMsg,
    redirectUrl
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
        case SET_AUTH_ERROR:
            return {
                ...state,
                accountApiErrorMsg
            }
        case REDIRECT_URL:
            return {
                ...state,
                redirectUrl
            }
        case PROCESS_FAILED :
            return {
                ...state,
                processFailed
            }
        case SEND_EMAIL :
            return {
                ...state,
                isEmailSent
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