import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom"
import style from './cookies-consent.module.scss'
import Button from "../../buttons/button/Button"
import Cookie from "js-cookie"
import { useTranslation } from "react-i18next"

export const CookiesConsent: React.FC = () => {

    const [isConsented, setConsented] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        const consent = Cookie.get('cookie-consent')
        consent && setConsented(true)
    }, [])

    if (isConsented) {
        return null
    }

    return (
        <div className={`${style.popup} cookie-consent-popup`}>
            <div className={style.content}>
                <p>{t('common:cookie_consent.text')}</p>
                <NavLink className={style.policyLink} to={'/cookie-policy'}>{t('common:nav.cookie')}</NavLink>
                <Button
                    title={t('common:buttons.agree')}
                    btnClass="btn-outlined btn"
                    handle={handleCookiesConsent}
                />
            </div>
        </div>
    )

    function handleCookiesConsent() {
        setConsented(true)
        Cookie.set('cookie-consent', 'OK')
    }
}
