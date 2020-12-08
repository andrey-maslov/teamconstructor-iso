import { PROCESS_FAILED, SET_ERROR } from "./actionTypes";
import { AnyType } from "../constants/types";

export function clearErrors(dispatch: AnyType): AnyType {
    dispatch({ type: SET_ERROR, apiErrorMsg: null })
    dispatch({ type: PROCESS_FAILED, processFailed: false })
}

export function apiErrorHandling(error: AnyType, dispatch: AnyType): AnyType {
    if (error.response) {
        const msg: string = error.response.data?.title || 'Something wrong with resources'
        dispatch({ type: SET_ERROR, apiErrorMsg: msg })
    } else if (error.request) {
        dispatch({ type: SET_ERROR, apiErrorMsg: 'Some troubles with network' })
    } else {
        console.error('ERROR', error.message)
    }
    dispatch({ type: PROCESS_FAILED, processFailed: true })
}

export function accountApiErrorHandling(error: AnyType, setError: AnyType): AnyType {
    if (error.response) {
        const { status, errors, title } = error.response.data
        if (status === 400) {
            setError('form', { message: title })
        }
        if (status === 404) {
            setError('form', { message: 'User with this email not found' })
        }
        if (status === 500) {
            setError('form', { message: 'something wrong' })
        }
        if (errors) {
            const { password, email } = errors
            if (password) {
                setSpecificError(password, setError)
            } else if (email) {
                setSpecificError(email, setError)
            } else {
                setError('form', { message: 'something wrong' })
            }
        }
    } else {
        setError('form', { message: 'something wrong' })
    }
}

function setSpecificError(errorList: string[], setError: AnyType): void {
    if (!Array.isArray(errorList)) {
        setError()
        setError('form', { message: 'something wrong' })
    }
    const msg = errorList.length > 1 ? errorList.join(', ') : errorList[0]
    setError('form', { message: msg })
}
