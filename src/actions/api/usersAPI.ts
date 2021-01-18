import { anyType } from "../../constants/types";
import { getAuthConfig, usersApiUrl } from "./utils";
import { SET_FOUND_USER_DATA } from "../actionTypes";
import { apiErrorHandling } from "../errorHandling";
import axios from "axios";
import { getCookieFromBrowser } from "../../helper/cookie";


export function fetchSearchedUser(email: string): anyType {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType) => {
        if (token) {
            axios(`${usersApiUrl}/search?email=${email}`, getAuthConfig(token))
                .then(res => res.data)
                .then(data => {
                    dispatch({ type: SET_FOUND_USER_DATA, foundUserData: data })
                    // dispatch(clearErrors())
                })
                .catch(error => apiErrorHandling(error, dispatch))
        } else {
            // dispatch(logOut())
            alert('not authorized')
        }
    };
}

export async function searchUser(email: string): Promise<anyType> {
    const token = getCookieFromBrowser('token')

    if (token) {
        try {
            const response = await axios(`${usersApiUrl}/search?email=${email}`, getAuthConfig(token))
            return response
        } catch (error) {
            if (error.response && error.response.status) {
                return error.response.status
            }
        }
    } else {
        return null
        // throw new Error('Error 401. Not authorized')
    }
}