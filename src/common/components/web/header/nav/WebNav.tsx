import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Button from '../../../common/buttons/button/Button';
import style from './web-nav.module.scss';
import PopoverUser from '../../../common/popovers/popover-user/PopoverUser';
import LangSwitcher from '../../../common/buttons/lang-switcher/LangSwitcher';

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
            <Button
                handle={handleLoginBtn}
                btnClass='btn-accent'
                title={t('common:buttons.login')}
                startIcon={<FiLogIn/>}
            />
        </div>
    );
};

export default WebNav;