import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom"
import style from './cookies-consent.module.scss'
import Button from "../../buttons/button/Button"
import { useTranslation } from "react-i18next"
import { getCookieFromBrowser, setCookie } from "../../../../helper/cookie";
import { isBrowser } from "../../../../helper/helper";

export const CookiesConsent: React.FC = () => {

    const [isConsented, setConsented] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        if(isBrowser) {
            const consent = getCookieFromBrowser('cookie-consent')
            consent && setConsented(true)
        }
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
        setCookie('cookie-consent', 'OK', 30)
    }
}
