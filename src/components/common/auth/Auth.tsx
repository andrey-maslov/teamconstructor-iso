import React, { useRef, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import Login, { ISigninForm } from './Login'
import Signup, { ISignUpForm } from './Signup'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { anyType, globalStoreType } from '../../../constants/types'
import { authUser, sendForgotEmail, sendNewPassword } from '../../../actions/actionCreator'
import Forgot, { IForgotForm } from './Forgot'
import Reset, { IResetForm } from './Reset'
import { authModes, SERVICE } from '../../../constants/constants'
import style from './auth.module.scss'
import { getQueryFromURL, isBrowser } from '../../../helper/helper'
import SocialAuth from "./social-auth/SocialAuth";


export interface IAuthMode {
    page: keyof typeof authModes
}

const Auth: React.FC<IAuthMode> = ({ page }) => {

    const { t } = useTranslation()
    const history = useHistory()
    const dispatch = useDispatch()
    const agreement = useRef<HTMLDivElement>(null)
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)
    const { accountApiErrorMsg, redirectUrl } = useSelector((state: globalStoreType) => state.app)

    useEffect(() => {

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

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/profile')
        }
    }, [isLoggedIn])

    const Form = () => {
        switch (page) {
            case authModes[0] :
                return (
                    <>
                        <Login
                            isLoading={false}
                            errorApiMessage={accountApiErrorMsg}
                            submitHandle={signIn}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <NavLink to="/signin/forgot-password">{t('common:auth.forgot_pwd_question')}</NavLink>
                            <NavLink to="/registration">{t('common:auth.signup')}</NavLink>
                        </div>
                        <SocialAuth />
                    </>
                )
            case authModes[1] :
                return (
                    <>
                        <Signup
                            isLoading={false}
                            errorApiMessage={accountApiErrorMsg}
                            submitHandle={signUp}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <NavLink to="/signin">{t('common:auth.signin')}</NavLink>
                        </div>
                        <SocialAuth />
                    </>
                )
            case authModes[2] :
                return (
                    <>
                        <Forgot
                            isLoading={false}
                            errorApiMessage={accountApiErrorMsg}
                            submitHandle={forgotHandle}
                        />
                        <NavLink to="/signin">{t('common:auth.ready_to_login')}</NavLink>
                    </>
                )
            case authModes[3] :
                return (
                    <>
                        <Reset
                            isLoading={false}
                            errorApiMessage={accountApiErrorMsg}
                            submitHandle={resetHandle}
                        />
                        <NavLink to="/signin">{t('common:auth.ready_to_login')}</NavLink>
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
                <Form />
            </div>
            <div
                ref={agreement}
                className={style.agreement}
                dangerouslySetInnerHTML={{ __html: t('common:auth.agreement', { button: t('common:buttons.signup') }) }}
            />
        </div>
    )

    function signIn(data: ISigninForm, setError: anyType): void {
        const userData = {
            username: data.username.trim(),
            password: data.password
        }
        dispatch(authUser(userData, 'signin', setError))
    }

    function signUp(data: ISignUpForm, setError: anyType): void {
        const trimmedData = {
            email: data.email.trim(),
            password: data.password,
            passwordConfirm: data.passwordConfirm
        }
        const userData = {
            firstName: '',
            lastName: '',
            city: {
                id: 0,
                name: 'city'
            },
            service: SERVICE,
            ...trimmedData
        }
        dispatch(authUser(userData, 'registration', setError))
    }

    function forgotHandle(data: IForgotForm, setError: anyType): void {
        dispatch(sendForgotEmail((data.email).trim(), setError))
    }

    function resetHandle(data: IResetForm, setError: anyType): void {
        let code: string
        if (isBrowser) {
            code = getQueryFromURL(window.location.search, 'code')
        } else {
            code = ''
        }
        const newData = {
            code,
            newPassword: data.password,
            email: (data.email).trim()
        }
        dispatch(sendNewPassword(newData, setError))
    }
}

export default Auth