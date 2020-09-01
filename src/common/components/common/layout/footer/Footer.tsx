import React from 'react';
import {useTranslation} from "react-i18next";
import SocialSharing from "../../buttons/social-sharing/SocialSharing";
import TopLogo from "../header/top-logo/TopLogo";
import {NavLink} from "react-router-dom";
import LangSwitcherAlt from "../../buttons/lang-switcher-alt/LangSwitcherAlt";
import style from './footer.module.scss';

const Footer = () => {

    const {t} = useTranslation();

    const links = [
        {
            link: '/privacy-policy',
            title: t('footer.links.privacy_policy'),
        },
        {
            link: '/terms',
            title: t('footer.links.terms'),
        },
        {
            link: '/cookie-policy',
            title: t('footer.links.cookie'),
        },
    ];

    const FooterLinks = () => {
        return (
            <ul className={style.list}>
                {links.map(({link, title}) => (
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
                <div className={style.logo}><TopLogo/></div>
                <FooterLinks/>
                <div className={style.copy}>
                    <div className="row justify-content-between">
                        <div className="col-md-6">
                            © {new Date().getFullYear()} | {t('common:footer.copy')}
                        </div>
                        <div className="col-md-6">
                            <LangSwitcherAlt/>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )

};

export default Footer;