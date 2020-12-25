import { CHANGE_PWD, CLEAR_USER_DATA, DANGER_MODAL, SEND_EMAIL, SET_AUTH_PROVIDER, SET_TOAST } from "../actionTypes"
import { anyType, AuthData, AuthType, INewPwdData, ISignInData, ISignUpData, IUserData } from "../../constants/types"
import { accountApiErrorHandling, apiErrorHandling, clearErrors } from "../errorHandling"
import { authModes } from "../../constants/constants"
import { getCookieFromBrowser, setCookie } from "../../helper/cookie"
import { logOut, setUserData } from "../actionCreator"
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
            .then(token => dispatch(fetchUserData(token)))
            .then(token => dispatch(fetchProjectList(token)))
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
    return (dispatch: anyType) => {
        if (token) {
            clearErrors(dispatch)
            axios
                .put(`${accountApiUrl}/update`, userData, getAuthConfig(token))
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
            .post(`${accountApiUrl}/reset-password`, { email })
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
