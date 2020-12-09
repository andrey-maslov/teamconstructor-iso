import { CHANGE_PWD, CLEAR_USER_DATA, DANGER_MODAL, SEND_EMAIL, SET_AUTH_PROVIDER, SET_TOAST } from "../actionTypes"
import { AnyType, INewPwdData, ISignInData, ISignUpData, IUserData } from "../../constants/types"
import { accountApiErrorHandling, apiErrorHandling, clearErrors } from "../errorHandling"
import { authModes } from "../../constants/constants"
import { getCookieFromBrowser, setCookie } from "../../helper/cookie"
import { logOut, setUserData } from "../actionCreator"
import { fetchProjectList } from "./projectsAPI"
import axios from "axios"
import { accountApiUrl, getAuthConfig } from "./utils"

export function checkAuth(jwt?: string): unknown {
    const token = jwt || getCookieFromBrowser('token')
    return (dispatch: AnyType) => {
        dispatch(fetchUserData(token))
        // dispatch(fetchProjectsList(token))
    }
}

export function authUser(
    userData: ISignUpData | ISignInData,
    authType: keyof typeof authModes,
    setError: AnyType
): AnyType {
    const url = `${accountApiUrl}/${authType === authModes[1] ? 'register' : 'authenticate'}`

    return (dispatch: AnyType) => {
        axios
            .post(url, userData)
            .then(res => {
                const token = res.data.jwtToken
                setCookie('token', token)
                dispatch({ type: SET_AUTH_PROVIDER, provider: 'local' })
                dispatch(fetchUserData(token))
                dispatch(fetchProjectList(token))
            })
            .catch(error => accountApiErrorHandling(error, setError))
    }
}

export function fetchUserData(token: string): unknown {
    return (dispatch: AnyType) => {
        if (token) {
            axios
                .get(accountApiUrl, getAuthConfig(token))
                .then(res => {
                    dispatch(setUserData(res.data))
                })
                .catch(error => console.error(error))
        } else {
            dispatch({ type: CLEAR_USER_DATA })
        }
    }
}

export const updateUserData = (userData: IUserData) => {
    const token = getCookieFromBrowser('token')
    return (dispatch: AnyType) => {
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
    return (dispatch: AnyType) => {
        axios
            .post(`${accountApiUrl}/reset-password`, { email })
            .then(() => dispatch({ type: SEND_EMAIL, isEmailSent: true }))
            .catch(error => accountApiErrorHandling(error, setError))
    }
}

export const sendNewPassword = (data: INewPwdData, setError: unknown): unknown => {
    return (dispatch: AnyType) => {
        axios
            .post(`${accountApiUrl}/confirm-reset-password`, data)
            .then(() => dispatch({ type: CHANGE_PWD, isPwdChanged: true }))
            .catch(error => accountApiErrorHandling(error, setError))
    }
}

export function deleteAccount(password: string): unknown {
    const token = getCookieFromBrowser('token')
    return (dispatch: AnyType) => {
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
