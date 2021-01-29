import {
    LOADING,
    SET_ERROR,
    PROCESS_FAILED,
    SEND_EMAIL,
    CHANGE_PWD, SET_AUTH_ERROR, REDIRECT_URL, EMAIL_CONFIRMATION, SET_TOAST
} from "../actions/actionTypes"

const APP = {
    isLoading: false,
    errorApiMessage: null,
    accountApiErrorMsg: null,
    redirectUrl: null,
    toastStatus: null,
    processFailed: false,
    isEmailSent: false,
    isEmailConfirmed: false,
    isPwdChanged: false
}

export type appStoreType = {
    type: string
    isLoading: boolean
    toastStatus: number | null
    errorApiMessage: '' | null
    accountApiErrorMsg: string | null
    redirectUrl: string | null
    processFailed: boolean
    isEmailSent: boolean
    isEmailConfirmed: boolean | null
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
    redirectUrl,
    isEmailConfirmed,
    toastStatus
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
        case SET_TOAST :
            return {
                ...state,
                toastStatus
            }
        case SEND_EMAIL :
            return {
                ...state,
                isEmailSent
            }
        case EMAIL_CONFIRMATION:
            return {
                ...state,
                isEmailConfirmed
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