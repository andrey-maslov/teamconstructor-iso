import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import style from './social.module.scss'
import { GoogleLogin } from './google-login/GoogleLogin'
import { FacebookLoginBtn } from './facebook-login/FacebookLoginBtn'
import { LinkedinLogin } from './linkedin-login/LinkedinLogin'
import { globalStoreType } from '../../../../constants/types'
import { socialAuth } from '../../../../actions/api/socialAuthAPI'


export type Provider = 'google' | 'facebook' | 'linkedin'
export type SocialAuthData<T> = T
export type GoogleAuthData = {
    idToken: string
}
export type FacebookAuthData = {
    accessToken: string
}
export type LinkedinAuthData = {
    authCode: string
    redirectUri: string
}

const SocialAuth = () => {
    const isEnabled = true
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { apiErrorMsg } = useSelector((state: globalStoreType) => state.app)

    return (
        <div className={style.wrapper}>
            <div className={style.desc}>{t('common:auth.or_continue_with')}:</div>
            <div className={style.buttons}>
                <div className={style.item}>
                    <GoogleLogin isEnabled={isEnabled} handleLogin={socialAuthHandle} />
                </div>
                <div className={style.item}>
                    <FacebookLoginBtn handleLogin={socialAuthHandle} isEnabled={isEnabled} />
                </div>
                <div className={style.item}>
                    <LinkedinLogin isEnabled={isEnabled} />
                </div>
            </div>
            {apiErrorMsg && <div className="item-explain danger">{apiErrorMsg}</div>}
        </div>
    )

    function socialAuthHandle<T>(data: T, provider: Provider): void {
        dispatch(socialAuth(data, provider))
    }
}

export default SocialAuth
