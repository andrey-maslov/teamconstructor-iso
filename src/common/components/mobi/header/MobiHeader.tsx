import React, { useState } from 'react';
import TopLogo from '../../common/layout/header/top-logo/TopLogo';
import MobiNav from '../../mobi/header/nav/MobiNav';
import MobileNavToggle from '../../mobi/header/nav-toggle/NavToggle';
import { IHeaderProps } from '../../web/header/WebHeader';
import style from './mobi-header.module.scss';
import LangSwitcher from '../../common/buttons/lang-switcher/LangSwitcher';

const MobiHeader = ({isLoggedIn, handleLoginBtn, setProject, userEmail, routes}: IHeaderProps) => {

    const [isMobiNavOpened, setMobiNav] = useState(false);

    const mobileNavOpen = (): any => {
        setMobiNav(true);
        document.body.classList.toggle('menu-opened');
    };

    const mobileNavClose = (): void => {
        setMobiNav(false);
        // if (e.target.classList.contains('mobile-nav-overlay') || e.target.classList.contains('nav-link')) {
        //     setMobiNav(false);
        //     document.body.classList.toggle('menu-opened');
        // }
    };

    return (
        <header className={style.header}>
            <div className="container">
                <div className={style.bar}>
                    <TopLogo/>
                    <MobileNavToggle handler={mobileNavOpen}/>
                </div>
            </div>
            <MobiNav
                isLoggedIn={isLoggedIn}
                close={mobileNavClose}
                isOpened={isMobiNavOpened}
                routes={routes}
            />
        </header>
    );

};

export default MobiHeader;