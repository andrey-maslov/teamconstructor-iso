import {
    CHANGE_PWD,
    CLEAR_USER_DATA,
    DANGER_MODAL,
    EMAIL_CONFIRMATION,
    SEND_EMAIL,
    SET_AUTH_PROVIDER,
    SET_TOAST
} from "../actionTypes"
import {
    anyType,
    AuthData,
    AuthType,
    globalStoreType, IEmailConfirmation,
    INewPwdData, IOneFieldForm,
    ISignInData,
    ISignUpData,
    IUserData
} from "../../constants/types"
import { accountApiErrorHandling, apiErrorHandling, clearErrors } from "../errorHandling"
import { authModes, SERVICE } from "../../constants/constants"
import { getCookieFromBrowser, setCookie } from "../../helper/cookie"
import { logOut, setLoading, setUserData } from "../actionCreator"
import { fetchProjectList } from "./projectsAPI"
import axios from "axios"
import { accountApiUrl, getAuthConfig } from "./utils"
import { fetchPsyData } from "./psychologicalTestsAPI";

export function checkAuth(jwt?: string): unknown {
    const token = jwt || getCookieFromBrowser('token')
    return (dispatch: anyType) => {
        dispatch(fetchUserData(token))
    }
}

export function authUser(userData: AuthData, authType: AuthType, setError: anyType): anyType {
    const url = `${accountApiUrl}/${authType === authModes[1] ? 'register' : 'authenticate'}`

    return (dispatch: anyType) => {
        axios
            .post(url, userData)
            .then(res => {
                const token = res.data.jwtToken
                setCookie('token', token)
                dispatch({ type: SET_AUTH_PROVIDER, provider: 'local' })
                return token
            })
            .then(token => {
                dispatch(fetchUserData(token))
                return token
            })
            .then(token => {
                dispatch(fetchProjectList(token))
                return token
            })
            .then(token => dispatch(fetchPsyData(token)))
            .catch(error => accountApiErrorHandling(error, setError))
    }
}

export function fetchUserData(token: string): unknown {
    return (dispatch: anyType) => {
        if (token) {
            axios
                .get(accountApiUrl, getAuthConfig(token))
                .then(res => dispatch(setUserData(res.data)))
                .then(() => dispatch(fetchProjectList(token)))
                .then(() => dispatch(fetchPsyData(token)))
                .catch(error => console.error(error))
        } else {
            dispatch({ type: CLEAR_USER_DATA })
        }
    }
}

export const updateUserData = (userData: IUserData) => {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType, getState: () => globalStoreType) => {
        if (token) {
            clearErrors(dispatch)
            const newUserData = { ...getState().user, ...userData }
            axios
                .put(`${accountApiUrl}/update`, newUserData, getAuthConfig(token))
                .then(res => {
                    dispatch(setUserData(res.data))
                    dispatch({ type: SET_TOAST, setToast: 1 })
                })
                .catch(error => {
                    apiErrorHandling(error, dispatch)
                    dispatch({ type: SET_TOAST, setToast: 2 })
                })
        } else {
            dispatch({ type: CLEAR_USER_DATA })
        }
    }
}

export const sendForgotEmail = (email: string, setError: unknown): unknown => {
    return (dispatch: anyType) => {
        axios
            .post(`${accountApiUrl}/reset-password`, { email, service: SERVICE })
            .then(() => dispatch({ type: SEND_EMAIL, isEmailSent: true }))
            .catch(error => accountApiErrorHandling(error, setError))
    }
}

export const sendNewPassword = (data: INewPwdData, setError: unknown): unknown => {
    return (dispatch: anyType) => {
        axios
            .post(`${accountApiUrl}/confirm-reset-password`, data)
            .then(() => dispatch({ type: CHANGE_PWD, isPwdChanged: true }))
            .catch(error => accountApiErrorHandling(error, setError))
    }
}

export const changeEmail = ({ email }: IOneFieldForm<string>) => {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType, getState: () => anyType) => {
        if (token) {
            clearErrors(dispatch)
            axios
                .post(
                    `${accountApiUrl}/change-email`,
                    { newEmail: email, service: SERVICE },
                    getAuthConfig(token)
                )
                .then(res => {
                    dispatch({ type: SEND_EMAIL, isEmailSent: true })
                    // TODO не нужно менять имейл сразу в стейте. Надо дождаться подтверждения и тогда поменять его
                    dispatch(setUserData({ ...getState().user, email }))
                })
                .catch(error => {
                    apiErrorHandling(error, dispatch)
                    dispatch({ type: SET_TOAST, setToast: 2 })
                })
        } else {
            dispatch({ type: CLEAR_USER_DATA })
        }
    }
}

export const sendEmailConfirmation = (data: IEmailConfirmation) => {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios
                .post(
                    `${accountApiUrl}/confirm-email`,
                    data,
                    getAuthConfig(token)
                )
                .then(res => {
                    dispatch(setUserData(res.data))
                    dispatch({ type: SET_TOAST, setToast: 1 })
                    dispatch({ type: EMAIL_CONFIRMATION, isEmailConfirmed: true })
                })
                .catch(error => {
                    apiErrorHandling(error, dispatch)
                    dispatch({ type: SET_TOAST, setToast: 2 })
                })
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch({ type: CLEAR_USER_DATA })
        }
    }
}

export function deleteAccount(password: string): unknown {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType) => {
        if (token) {
            axios
                .post(`${accountApiUrl}/delete`, { password }, getAuthConfig(token))
                .then(() => {
                    dispatch(logOut())
                    dispatch({ type: DANGER_MODAL, isDangerModal: false })
                })
                .catch(error => apiErrorHandling(error, dispatch))
        } else {
            dispatch({ type: CLEAR_USER_DATA })
        }
    }
}
