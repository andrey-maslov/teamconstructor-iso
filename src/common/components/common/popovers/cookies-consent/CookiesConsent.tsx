import React from 'react';
import {NavLink} from "react-router-dom";
import style from './cookies-consent.module.scss';
import Button from "../../buttons/button/Button";

const cookiesConsentText = 'Мы заботимся о вас, поэтому надо согласиться с нашей политикой куки';

interface CookiesConsentProps {
    isVisible: boolean
    handleCookies: () => void
}

export const CookiesConsent: React.FC<CookiesConsentProps> = ({isVisible, handleCookies}) => {

    if (!isVisible) {
        return null
    }

    return (
        <div className={style.popup}>
            <div className={style.content}>
                <p>{cookiesConsentText}</p>
                {/*<NavLink className={style.policyLink} to={'/cookie-policy'}>Политика Куки</NavLink>*/}
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <Button
                    title="Я согласен"
                    btnClass="btn-accent btn"
                    handle={handleCookies}
                />
            </div>
        </div>
    )
};
