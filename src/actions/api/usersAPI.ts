import { AnyType } from "../../constants/types";
import { getAuthConfig, usersApiUrl } from "./utils";
import { SET_ACTIVE_PROJECT, SET_PROJECTS } from "../actionTypes";
import { apiErrorHandling } from "../errorHandling";
import axios from "axios";
import { getCookieFromBrowser } from "../../helper/cookie";

export function fetchUser(email: string): AnyType {
    const token = getCookieFromBrowser('token')
    return (dispatch: AnyType) => {
        if (token) {
            axios(`${usersApiUrl}/search`, getAuthConfig(token))
                .then(res => res.data)
                .then(data => {

                    // dispatch(clearErrors())
                })
                .catch(error => apiErrorHandling(error, dispatch))
        } else {
            // dispatch(logOut())
            alert('not authorized')
        }
    };
}