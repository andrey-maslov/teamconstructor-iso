import React, {useEffect, useState} from 'react'
import {NavLink} from "react-router-dom"
import style from './cookies-consent.module.scss'
import Button from "../../buttons/button/Button"
import Cookie from "js-cookie"

const cookiesConsentText = 'Мы заботимся о вас, поэтому надо согласиться с нашей политикой куки'


export const CookiesConsent: React.FC = () => {

    const [isConsented, setConsented] = useState(false)

    useEffect(() => {
        const consent = Cookie.get('cookie-consent')
        consent && setConsented(true)
    }, [])

    if (isConsented) {
        return null
    }

    return (
        <div className={style.popup}>
            <div className={style.content}>
                <p>{cookiesConsentText}</p>
                <NavLink className={style.policyLink} to={'/cookie-policy'}>Политика Куки</NavLink>
                <Button
                    title="Я согласен"
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
};
