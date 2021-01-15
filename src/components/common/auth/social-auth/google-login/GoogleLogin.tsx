import React from 'react'
import { GoogleLoginButton } from 'ts-react-google-login-component'
import { FaGoogle } from 'react-icons/fa'
import Button from '../../../buttons/button/Button'

export interface LoginBtnProps {
    handleLogin: (name: string, email: string) => void
    isEnabled: boolean
}

export const GoogleLogin: React.FC<LoginBtnProps> = ({ handleLogin, isEnabled }) => {
    const preLoginTracking = (): void => {
        console.log('Attempt to login with google')
    }

    const errorHandler = (error: string): void => {
        // handle error if login got failed...
        console.error(`FAIL: ${error}`)
    }

    const responseGoogle = (googleUser: gapi.auth2.GoogleUser): void => {
        const profile = googleUser.getBasicProfile()
        const name = profile.getName()
        const email = profile.getEmail()

        handleLogin(name, email)
    }

    const clientConfig = { client_id: process.env.GOOGLE_CLIENT_ID }

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
