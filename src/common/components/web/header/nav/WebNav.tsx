import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Button from '../../../common/buttons/button/Button';
import PopoverUser from '../../../common/popovers/popover-user/PopoverUser';
import LangSwitcher from '../../../common/buttons/lang-switcher/LangSwitcher';
import {NavLink} from "react-router-dom";
import style from './web-nav.module.scss';

export type Navigation = {
    handleLoginBtn: () => void
    isLoggedIn: boolean
    userEmail: string
}

const WebNav = ({handleLoginBtn, isLoggedIn, userEmail}: Navigation) => {

    const {t} = useTranslation();

    if (isLoggedIn) {
        return (
            <div className={style.nav}>
                <LangSwitcher/>
                <NavLink className={'btn btn-outlined'} to={'/team'}>TEAM</NavLink>
                <PopoverUser
                    userEmail={userEmail}
                    logoutHandle={handleLoginBtn}
                />
            </div>
        );
    }

    return (
        <div className={style.nav}>
            <LangSwitcher/>
            <NavLink className={'btn btn-outlined'} to={'/team'}>TEAM</NavLink>
            <Button
                handle={handleLoginBtn}
                btnClass='btn-link'
                title={t('common:buttons.login')}
                startIcon={<FiLogIn/>}
            />
        </div>
    );
};

export default WebNav;