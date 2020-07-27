import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiDollarSign } from 'react-icons/fi';
import { SITE_TITLE } from '../../../../../constants/constants';
import style from './mobi-nav.module.scss';
import {INavRoute} from "../../../../../constants/types";

type MobiNavigation = {
    isLoggedIn: boolean
    close: () => void
    isOpened: boolean
    routes: INavRoute[]
}

const MobiNav = ({isLoggedIn, close, isOpened, routes}: MobiNavigation) => {

    const isOpenedClass = isOpened ? 'opened' : 'closed';

    return (
        <div className={`${style.overlay} ${style[isOpenedClass]} mobile-nav-overlay`} onClick={close}>
            <nav className={`${style.wrapper} mobile-nav-wrapper`}>
                <h5 className={style.title}>Some title</h5>
                <ul className={style.nav}>
                    {routes.map(({title, path, access, icon}) => {
                        return (
                            <li className={style.item} key={title}>
                                <NavLink exact
                                         className={`${style.link} nav-link`}
                                         activeClassName={style.current}
                                         to={path}
                                         onClick={close}
                                >
                                    {icon}{title}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
                <div className={style.footer}>
                    <div className={style.copy}>
                        © {new Date().getFullYear()} | {SITE_TITLE}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default MobiNav;