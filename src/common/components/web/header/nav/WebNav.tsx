import React from 'react'
import { useTranslation } from 'react-i18next'
import PopoverUser from '../../../common/popovers/popover-user/PopoverUser'
import LangSwitcher from '../../../common/buttons/lang-switcher/LangSwitcher'
import { NavLink } from "react-router-dom"
import style from './web-nav.module.scss'
import { INavRoute } from "../../../../../constants/types"

export type NavigationType = {
    handleLoginBtn: () => void
    isLoggedIn: boolean
    userEmail: string
    routes: INavRoute[]
}

const WebNav: React.FC<NavigationType> = ({ isLoggedIn, handleLoginBtn, routes }) => {

    const { t } = useTranslation()

    return (
        <div className={style.nav}>
            <LangSwitcher />
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
                <ul className={`${style.list} ${style.auth}`}>
                    <li>
                        <NavLink to="/signin" className={style.link}>
                            {t('common:buttons.login')}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/registration" className={style.link}>
                            {t('common:buttons.signup')}
                        </NavLink>
                    </li>
                </ul>
            }
        </div>
    )
}

export default WebNav
