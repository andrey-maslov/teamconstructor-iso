import React from 'react'
import { useTranslation } from 'react-i18next'
import TopLogo from '../header/top-logo/TopLogo'
import { NavLink } from 'react-router-dom'
import LangSwitcherAlt from '../../buttons/lang-switcher-alt/LangSwitcherAlt'
import style from './footer.module.scss'
import { CONTACT_EMAIL } from '../../../../constants/constants'

const Footer: React.FC = () => {

    const { t } = useTranslation();

    const links = [
        {
            link: '/privacy-policy',
            title: t('common:nav.privacy_policy'),
        },
        {
            link: '/terms',
            title: t('common:nav.terms'),
        },
        {
            link: '/cookie-policy',
            title: t('common:nav.cookie'),
        },
    ]

    const FooterLinks = () => {
        return (
            <ul className={style.list}>
                {links.map(({ link, title }) => (
                    <li className={style.item} key={title}>
                        <NavLink to={link} tabIndex={0}>
                            {title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <footer className={`${style.footer} footer`}>
            <div className="container">
                <div className={style.logo}>
                    <TopLogo />
                </div>
                <FooterLinks />
                <div className={style.copy}>
                    <div className="row justify-content-between">
                        <div className="col-md-4">
                            <div className={style.copyBox}>
                                © {new Date().getFullYear()} | {t('common:footer.copy')}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className={style.copyBox}>
                                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className={style.copyBox}>
                                <LangSwitcherAlt />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
