import React, {useState} from 'react';
import Login from "./Login";
import Register from "./Register";

import style from './auth.module.scss'


interface IAuthMode {
    mode: 'login' | 'register'
}

const Auth: React.FC = () => {

    const [authMode, setAuthMode] = useState<IAuthMode>({mode: 'login'})

    return (
        <div className={style.wrapper}>
            <div className={style.tabs}>
                <button
                    className={`${authMode.mode === 'login' ? style.active : ''}`}
                    onClick={() => setAuthMode({mode: 'login'})}
                >
                    Login
                </button>
                <button
                    className={`${authMode.mode === 'register' ? style.active : ''}`}
                    onClick={() => setAuthMode({mode: 'register'})}
                >
                    Register
                </button>
            </div>
            {authMode.mode === 'login' ?
                <Login/> :
                <Register/>}
        </div>
    );
}

export default Auth;