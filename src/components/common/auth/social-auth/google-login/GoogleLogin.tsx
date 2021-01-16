import React from 'react'
import { GoogleLoginButton } from 'ts-react-google-login-component'
import { useDispatch } from 'react-redux'
import { FaGoogle } from 'react-icons/fa'
import { GoogleAuthData, Provider } from "../SocialAuth";
import { SET_ERROR } from "../../../../../actions/actionTypes";
import Button from "../../../buttons/button/Button";

export interface LoginBtnProps<T> {
    handleLogin: (data: T, provider: Provider) => void
    isEnabled: boolean
}

export const GoogleLogin: React.FC<LoginBtnProps<GoogleAuthData>> = ({
                                                                         handleLogin,
                                                                         isEnabled
                                                                     }) => {
    const dispatch = useDispatch()
    const preLoginTracking = (): void => {
        console.log('Attempt to login with google')
    }

    const errorHandler = (error: string): void => {
        // handle error if login got failed...
        console.error(`FAIL: ${error}`)
        dispatch({ type: SET_ERROR, errorApiMessage: `Google auth failure: ${error}` })
    }

    const responseGoogle = (googleUser: gapi.auth2.GoogleUser): void => {
        const { id_token } = googleUser.getAuthResponse()
        handleLogin({ idToken: id_token }, 'google')
    }

    const clientConfig = { client_id: process.env.RAZZLE_GOOGLE_CLIENT_ID }

    return (
        <GoogleLoginButton
            responseHandler={responseGoogle}
            clientConfig={clientConfig}
            preLogin={preLoginTracking}
            failureHandler={errorHandler}>
            <Button
                handle={() => null}
                btnClass="btn btn-google"
                title=""
                startIcon={<FaGoogle />}
                isEnabled={isEnabled}
            />
        </GoogleLoginButton>
    )
}
