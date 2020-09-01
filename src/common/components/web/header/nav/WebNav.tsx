import React from 'react';
import {FiLogIn} from 'react-icons/fi';
import {useTranslation} from 'react-i18next';
import Button from '../../../common/buttons/button/Button';
import PopoverUser from '../../../common/popovers/popover-user/PopoverUser';
import LangSwitcher from '../../../common/buttons/lang-switcher/LangSwitcher';
import {NavLink} from "react-router-dom";
import style from './web-nav.module.scss';
import {INavRoute} from "../../../../../constants/types";

export type NavigationType = {
    handleLoginBtn: () => void
    isLoggedIn: boolean
    userEmail: string
    routes: INavRoute[]
}

const WebNav: React.FC<NavigationType> = ({isLoggedIn, handleLoginBtn, userEmail, routes}) => {

    const {t} = useTranslation()

    return (
        <div className={style.nav}>
            <LangSwitcher/>
            <ul className={style.list}>
                {routes.map(route => (
                    <li key={route.title}>
                        <NavLink
                            className={style.link}
                            exact
                            to={route.path}
                            activeClassName={style.current}
                        >
                            {route.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
            {isLoggedIn ?
                <PopoverUser
                    logoutHandle={handleLoginBtn}
                /> :
                <Button
                    handle={handleLoginBtn}
                    btnClass='btn-link'
                    title={t('common:buttons.login')}
                    startIcon={<FiLogIn/>}
                />}
        </div>
    );
};

export default WebNav;