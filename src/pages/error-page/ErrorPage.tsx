import React from 'react'
import { useTranslation } from 'react-i18next'
import style from './error-page.module.scss'
import { NavLink } from 'react-router-dom'

const ErrorPage: React.FC = () => {

    const {t} = useTranslation()

    return (
        <div className={`main section flex-centered ${style.wrapper}`}>
            <div className="container">
                <h1>{t('404:title')}</h1>
                <div className={style.content} dangerouslySetInnerHTML={{__html: t('404:text1')}}/>
                <NavLink to='/' className='btn btn-outlined'>{t('common:buttons.to_main')}</NavLink>
            </div>
        </div>
    );
};

export default ErrorPage