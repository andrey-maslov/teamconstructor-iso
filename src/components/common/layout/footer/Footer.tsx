import React from 'react'
import { useTranslation } from 'react-i18next'
import TopLogo from '../header/top-logo/TopLogo'
import { NavLink, useLocation } from 'react-router-dom'
import LangSwitcherAlt from '../../buttons/lang-switcher-alt/LangSwitcherAlt'
import style from './footer.module.scss'
import { CONTACT_EMAIL } from '../../../../constants/constants'
import PayProviders from '../PayProviders/PayProviders'

const Footer: React.FC = () => {

    const { t } = useTranslation()
    const { pathname } = useLocation()
    const showExtendedFooter = pathname === '/' || pathname === '/subscriptions'

    const links = [
        {
            link: '/terms',
            title: t('common:nav.terms'),
        },
        {
            link: '/rules-of-getting-and-cancelling',
            title: t('common:nav.rules_of_getting_cancelling'),
        },
        {
            link: '/cookie-policy',
            title: t('common:nav.cookie'),
        },
        {
            link: '/privacy-policy',
            title: t('common:nav.privacy_policy'),
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

                {showExtendedFooter && (
                    <div>
                        <PayProviders />

                        <div className="row between-sm">
                            <div className="col-lg-8">
                                <p>{t('common:footer.copy')}</p>
                                <p>{t('common:footer.address')}</p>
                                <p>{t('common:footer.UNP')}: 491497109</p>
                                <p>{t('common:footer.bank')}</p>
                            </div>
                            <div className="col-lg-4"><FooterLinks /></div>
                        </div>
                    </div>
                )}
                {!showExtendedFooter && <div className={style.line}><FooterLinks /></div>}
                <div className={style.copy}>
                    <div className="row justify-content-between">
                        <div className="col-md-4">
                            <div className={style.copyBox}>
                                © {new Date().getFullYear()} | {t('common:footer.copy').replace(/"/gi, '' )}
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
