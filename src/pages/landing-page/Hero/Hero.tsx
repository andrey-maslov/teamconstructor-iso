import React from 'react'
import style from './hero.module.scss'
import { useSelector } from 'react-redux'
import { globalStoreType } from '../../../constants/types'
import { useTranslation } from 'react-i18next'
import { NavLink } from "react-router-dom";
import { IS_UNDER_CONSTR } from "../../../constants/constants";

const Hero: React.FC = () => {

    const { t } = useTranslation()
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)

    return (
        <section className={style.section}>
            <div className="container">
                <div className={style.content}>
                    <p className={style.supTitle}>{t('landing:hero.sup_title')}</p>
                    <h1 className={style.title}>
                        <span>T</span><span>E</span><span>A</span><span>M</span> CONSTRUCTOR
                    </h1>
                    <p className={style.subtitle}>
                        {t('landing:hero.sub_title')}
                    </p>
                    {!IS_UNDER_CONSTR && (
                        <div className={style.buttons}>
                            <NavLink
                                to={isLoggedIn ? '/team' : '/registration'}
                                className="btn btn-outlined-yellow btn-lg">
                                {t('landing:hero.button_title')}
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Hero