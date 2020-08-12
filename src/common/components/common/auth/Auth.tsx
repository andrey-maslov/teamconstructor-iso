import React, {useState} from 'react';
import Login from "./Login";
import Register from "./Register";

import style from './auth.module.scss'


const Auth: React.FC = () => {

    const [isLogin, setLogin] = useState(false)

    return (
        <div className={style.wrapper}>
            <div className={style.tabs}>
                <button className={`${isLogin ? style.active : ''}`} onClick={() => setLogin(true)}>Login</button>
                <button className={`${!isLogin ? style.active : ''}`} onClick={() => setLogin(false)}>Register</button>
            </div>
            {isLogin ?
                <Login/> :
                <Register/>}
        </div>
    );
}

export default Auth;