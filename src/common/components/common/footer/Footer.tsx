import React from 'react';
import {useTranslation} from "react-i18next";
import style from './footer.module.scss';
import SocialSharing from "../buttons/social-sharing/SocialSharing";

const Footer = () => {

    const {t} = useTranslation();

    return (
        <footer className={style.footer}>
            <div className="container">
                <div className={style.sharing}>
                    {t('common:footer.sharing_text')}
                    <SocialSharing/>
                </div>
                <div className={style.copy}>
                    <div className="row justify-content-between">
                        <div className="col-md-6">
                            © {new Date().getFullYear()} | {t('common:footer.copy')}
                        </div>
                        <div className="col-md-6">
                            {t('common:footer.author_text')}
                            <a href='https://maslov.work' target='_blank' rel='noreferrer noopener'>
                                maslov.work
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )

};

export default Footer;