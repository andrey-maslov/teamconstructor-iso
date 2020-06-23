import React from 'react';
import TopLogo from '../../common/header/top-logo/TopLogo';
import WebNav from './nav/WebNav';
import style from './web-header.module.scss';

export type Header = {
    isLoggedIn: boolean
    handleLoginBtn: () => void
    userEmail: string
}

const WebHeader = ({isLoggedIn, handleLoginBtn, userEmail}: Header) => {

    return (
        <header className={style.header}>
            <div className="container">
                <nav className={style.bar}>
                    <TopLogo/>
                    <WebNav
                        isLoggedIn={isLoggedIn}
                        handleLoginBtn={handleLoginBtn}
                        userEmail={userEmail}
                    />
                </nav>
            </div>
        </header>
    );
};

export default WebHeader;