import React from 'react'
import {NavLink} from 'react-router-dom'
import logo from  '../../../../../assets/img/tc-logo-sm.svg'

import style from './top-logo.module.scss'

const TopLogo: React.FC = () => {

    return (
        <div className={style.logo}>
            <NavLink to={'/'} className={style.testLink}>
                <img src={logo} alt="Logo" />
            </NavLink>
        </div>
    );
};

export default TopLogo;