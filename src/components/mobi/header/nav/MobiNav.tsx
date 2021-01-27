import React from 'react'
import { NavLink } from 'react-router-dom'
import { SITE_TITLE } from '../../../../constants/constants'
import style from './mobi-nav.module.scss'
import Button from '../../../common/buttons/button/Button'
import { INavigation } from '../../../web/header/nav/WebNav'
import { useTranslation } from 'react-i18next'
import { MobiNavLink } from './MobiNavLink'
import LangSwitcherAlt from '../../../common/buttons/lang-switcher-alt/LangSwitcherAlt'
import ProjectList from "../../../common/team-coop/project-list/ProjectList";

interface IMobiNav extends INavigation {
    isOpened: boolean
    closeNav: () => void
}

const MobiNav = ({ isLoggedIn, isOpened, handleLogoutBtn, routes, closeNav, userEmail }: IMobiNav) => {

    const { t } = useTranslation()
    const isOpenedClass = isOpened ? 'opened' : 'closed'

    return (
        <div className={`${style.overlay} ${style[isOpenedClass]} mobile-nav-overlay`} onClick={close}>
            <nav className={`${style.wrapper} mobile-nav-wrapper`}>
                <div className={style.header}>
                    <h5 className={style.title}>{SITE_TITLE}</h5>
                    {userEmail && <div className={style.user}>{userEmail}</div>}
                </div>
                <ul className={style.nav}>
                    {routes.map(({ title, path, access, icon }) => {
                        if (!isLoggedIn && access === 'all') {
                            return <MobiNavLink
                                title={title}
                                path={path}
                                icon={icon}
                                onClick={closeNav}
                                key={path}
                            />
                        } else if (isLoggedIn) {
                            return <MobiNavLink
                                title={title}
                                path={path}
                                icon={icon}
                                onClick={closeNav}
                                key={path}
                            />
                        }
                        return null
                    })}
                </ul>
                {isLoggedIn && (
                    <div className={style.projects}>
                        <ProjectList closePopup={closeNav} />
                    </div>
                )}
                <ul className={style.auth}>
                    {isLoggedIn ? (
                        <li>
                            <Button
                                title="Log Out"
                                btnClass="btn btn-outlined"
                                handle={handleLogoutBtn}
                            />
                        </li>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/signin" onClick={closeNav}>
                                    <a className="btn btn-accent">
                                        {t('common:buttons.signin')}
                                    </a>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/registration" onClick={closeNav}>
                                    <a className="btn btn-outlined">
                                        {t('common:buttons.signup')}
                                    </a>
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
                <div className={style.footer}>
                    <LangSwitcherAlt />
                </div>
            </nav>
            <div className={style.closure} onClick={closeNav} />
        </div>
    )
}

export default MobiNav
