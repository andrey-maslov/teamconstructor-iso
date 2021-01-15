import React from 'react'
import { FaFacebookF } from 'react-icons/fa'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import Button from '../../../buttons/button/Button'
import { LoginBtnProps } from '../google-login/GoogleLogin'

export const FacebookLoginBtn: React.FC<LoginBtnProps> = ({ handleLogin, isEnabled }) => {
    const responseFacebook = (response: any) => {
        handleLogin(response.name, response.email)
    }

    const handleFailure = (response: any) => {
        console.log('facebook auth failure')
    }

    return (
        <FacebookLogin
            appId={process.env.FACEBOOK_APP_ID}
            fields="name,email,picture"
            callback={responseFacebook}
            onFailure={handleFailure}
            render={(renderProps: any) => (
                <Button
                    handle={renderProps.onClick}
                    btnClass="btn btn-facebook"
                    title=""
                    startIcon={<FaFacebookF />}
                    isEnabled={isEnabled}
                />
            )}
        />
    )
}
