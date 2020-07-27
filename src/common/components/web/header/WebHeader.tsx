import React from 'react';
import TopLogo from '../../common/layout/header/top-logo/TopLogo';
import WebNav from './nav/WebNav';
import style from './web-header.module.scss';
import {INavRoute} from "../../../../constants/types";

export interface IHeaderProps {
    isLoggedIn: boolean
    handleLoginBtn: () => void
    userEmail: string
    routes: INavRoute[]
}

const WebHeader: React.FC<IHeaderProps> = (props) => {

    return (
        <header className={style.header}>
            <nav className={style.bar}>
                <TopLogo/>
                <WebNav
                    {...props}
                />
            </nav>
        </header>
    );
};

export default WebHeader;