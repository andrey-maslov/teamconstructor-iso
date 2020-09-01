import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './error-page.module.scss';
import { NavLink } from 'react-router-dom';

const ErrorPage = () => {

    const {t} = useTranslation();

    return (
        <div className={`main section flex-centered ${style.wrapper}`}>
            <div className="container">
                <h1>{t('common:404_page.title')}</h1>
                <div className={style.content} dangerouslySetInnerHTML={{__html: t('common:404_page.description')}}/>
                <NavLink to='/' className='btn btn-accent'>{t('common:buttons.to_main')}</NavLink>
            </div>
        </div>
    );
};

export default ErrorPage;