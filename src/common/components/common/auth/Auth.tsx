import React, {useRef, useEffect, useState} from 'react'
import {NavLink, useHistory, useLocation} from 'react-router-dom'
import Login, {ILoginForm} from "./Login"
import Signup, {ISignUpForm} from "./Signup"
import {useTranslation} from "react-i18next"
import {useDispatch, useSelector} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import {authUser, sendForgotEmail, sendNewPassword} from "../../../actions/actionCreator"
import {SET_ERROR} from "../../../actions/actionTypes"
import Forgot, {IForgotForm} from "./Forgot"
import Reset, {IResetForm} from "./Reset"
import {authModes} from "../../../../constants/constants"

import style from './auth.module.scss'
import ForgotSuccess from "./ForgotSuccess";
import {getQueryFromURL} from "../../../../helper/helper";


export interface IAuthMode {
    page: keyof typeof authModes
}

const Auth: React.FC<IAuthMode> = ({page}) => {

    const {t} = useTranslation()
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const agreement = useRef<HTMLDivElement>(null)
    const {isLoggedIn} = useSelector((state: GlobalStateType) => state.userData)
    const {isLoading, errorApiMessage} = useSelector((state: GlobalStateType) => state.appReducer)

    useEffect(() => {

        if (isLoggedIn) {
           history.push('/team')
        }

        let termsLink: Element | null
        let privacyLink: Element | null
        if (agreement) {
            const el = agreement.current
            termsLink = el ? el.children[0] : null
            privacyLink = el ? el.children[1] : null
            termsLink && termsLink.addEventListener('click', toTerms)
            privacyLink && privacyLink.addEventListener('click', toPrivacy)
        }

        function toTerms() {
            history.push('/terms')
        }

        function toPrivacy() {
            history.push('/privacy-policy')
        }

        return function cleanupListener() {
            termsLink && termsLink.removeEventListener('click', toTerms)
            privacyLink && privacyLink.removeEventListener('click', toPrivacy)
        }
    }, [agreement, isLoggedIn])

    const Form = () => {
        switch (page) {
            case authModes[0] :
                return (
                    <>
                        <Login
                            isLoading={isLoading}
                            errorApiMessage={errorApiMessage}
                            submitHandle={logIn}
                            clearApiError={clearApiError}
                        />
                        <NavLink to="/login/forgot-password">{t('common:auth.forgot_pwd_question')}</NavLink>
                    </>
                )
            case authModes[1] :
                return (
                    <Signup
                        isLoading={isLoading}
                        errorApiMessage={errorApiMessage}
                        submitHandle={signUp}
                        clearApiError={clearApiError}
                    />
                )
            case authModes[2] :
                return (
                    <>
                        <Forgot
                            isLoading={isLoading}
                            errorApiMessage={errorApiMessage}
                            submitHandle={forgotHandle}
                            clearApiError={clearApiError}
                        />
                        <NavLink to="/login">{t('common:auth.ready_to_login')}</NavLink>
                    </>
                )
            case authModes[3] :
                return (
                    <>
                        <Reset
                            isLoading={isLoading}
                            errorApiMessage={errorApiMessage}
                            submitHandle={resetHandle}
                            clearApiError={clearApiError}
                        />
                        <NavLink to="/login">{t('common:auth.ready_to_login')}</NavLink>
                    </>
                )
            case authModes[4] :
                return (
                    <>
                        <ForgotSuccess />
                        <NavLink to="/login">{t('common:auth.ready_to_login')}</NavLink>
                    </>
                )
            default :
                return null
        }
    }

    return (
        <div>
            <div className={style.wrapper}>
                <h1 className={style.title}>{t(`common:auth.${page}`)}</h1>
                <Form/>
            </div>
            <div
                ref={agreement}
                className={style.agreement}
                dangerouslySetInnerHTML={{__html: t('common:auth.agreement', {button: t('common:buttons.signup')})}}
            />
        </div>
    );

    function logIn(data: ILoginForm): void {
        dispatch(authUser(data, 'login'))
    }

    function forgotHandle(data: IForgotForm): void {
        dispatch(sendForgotEmail(data.email))
    }

    function resetHandle(data: IResetForm): void {
        const code = getQueryFromURL(location.search, 'code')
        const newData = {
            code,
            password: data.password,
            passwordConfirmation: data.passwordConfirm,
        }
        dispatch(sendNewPassword(newData))
    }

    function signUp(data: ISignUpForm): void {
        const userData = {
            username: data.name,
            email: data.email,
            password: data.password,
        }
        dispatch(authUser(userData, 'signup'))
    }



    function clearApiError() {
        // console.log('asdasd')
        // dispatch({type: SET_ERROR, errorApiMessage: ''})
    }

}

export default Auth;