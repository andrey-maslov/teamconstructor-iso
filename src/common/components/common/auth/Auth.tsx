import React, {useState} from 'react'
import Login from "./Login"
import Register from "./Register"

import style from './auth.module.scss'
import {useTranslation} from "react-i18next";


interface IAuthMode {
    mode: 'login' | 'register'
}

const Auth: React.FC = () => {

    const [authMode, setAuthMode] = useState<IAuthMode>({mode: 'login'})
    const {t} = useTranslation()

    return (
        <div className={style.wrapper}>
            <div className={style.tabs}>
                <button
                    className={`${authMode.mode === 'login' ? style.active : ''}`}
                    onClick={() => setAuthMode({mode: 'login'})}
                >
                    {t('common:buttons.login')}
                </button>
                <button
                    className={`${authMode.mode === 'register' ? style.active : ''}`}
                    onClick={() => setAuthMode({mode: 'register'})}
                >
                    {t('common:buttons.register')}
                </button>
            </div>
            {authMode.mode === 'login' ?
                <Login/> :
                <Register/>}
        </div>
    );
}

export default Auth;