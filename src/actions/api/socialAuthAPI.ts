import axios from 'axios'
import { accountApiUrl } from './utils'
import { Provider } from '../../components/common/auth/social-auth/SocialAuth'
import { setCookie } from '../../helper/cookie'
import { SET_AUTH_PROVIDER } from '../actionTypes'
import { apiErrorHandling } from '../errorHandling'
import { fetchUserData } from './accountAPI'
import { anyType } from "../../constants/types";

// TODO change
export const socialAuth = <T>(data: T, provider: Provider) => {
    return (dispatch: anyType) => {
        axios
            .post(`${accountApiUrl}/${provider}-login`, data)
            .then(res => {
                const token = res.data.jwtToken
                setCookie('token', token, 10)
                dispatch({ type: SET_AUTH_PROVIDER, provider })
                return token
            })
            .then(token => {
                dispatch(fetchUserData(token))
                return token
            })
            .then(token => dispatch(fetchUserData(token)))
            .catch(error => apiErrorHandling(error, dispatch))
    }
}
