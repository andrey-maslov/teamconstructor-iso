import React from 'react'
import { useDispatch } from 'react-redux'
import { FaFacebookF } from 'react-icons/fa'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { LoginBtnProps } from '../google-login/GoogleLogin'
import { FacebookAuthData } from "../SocialAuth";
import { SET_ERROR } from "../../../../../actions/actionTypes";
import Button from "../../../buttons/button/Button";

export const FacebookLoginBtn: React.FC<LoginBtnProps<FacebookAuthData>> = ({ handleLogin, isEnabled }) => {
    const dispatch = useDispatch()

    const responseFacebook = (response: any) => {
        const { accessToken } = response
        handleLogin({ accessToken }, 'facebook')
    }

    const handleFailure = (response: any) => {
        console.log('facebook auth failure')
        dispatch({ type: SET_ERROR, errorApiMessage: 'facebook auth failure' })
    }

    return (
        <FacebookLogin
            appId={process.env.RAZZLE_FACEBOOK_APP_ID}
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
