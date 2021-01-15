import React from 'react'
import { useTranslation } from "react-i18next"
import style from './social.module.scss'
import { GoogleLogin } from './google-login/GoogleLogin'
import { FacebookLoginBtn } from './facebook-login/FacebookLoginBtn'
import { LinkedinLogin } from './linkedin-login/LinkedinLogin'

const SocialAuth = () => {
    const isEnabled = true
    const { t } = useTranslation()

    return (
        <div className={style.wrapper}>
            <div className={style.desc}>{t('common:auth.or_continue_with')}</div>
            <div className={style.buttons}>
                <div className={style.item}>
                    <GoogleLogin handleLogin={() => console.log('google')} isEnabled={isEnabled} />
                </div>
                <div className={style.item}>
                    <FacebookLoginBtn
                        handleLogin={() => console.log('facebook')}
                        isEnabled={isEnabled}
                    />
                </div>
                <div className={style.item}>
                    <LinkedinLogin isEnabled={isEnabled} />
                </div>
            </div>
        </div>
    )
}

export default SocialAuth
