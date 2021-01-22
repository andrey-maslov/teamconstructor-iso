import React, { useState, useEffect } from 'react'
import style from './prices.module.scss'
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTariffs } from "../../../components/common/hooks/use-tariffs";
import { globalStoreType, IMembershipPlan } from "../../../constants/types";
import Button from "../../../components/common/buttons/button/Button";

const Prices: React.FC = () => {

    const tariffs = useTariffs()
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)
    const free = tariffs.filter(item => item.id === 0)[0]
    const paidList = tariffs.filter(item => (item.id === 3 || item.id === 4))
    const [paidTariffToShow, setPaidTariffToShow] = useState<IMembershipPlan | null>(null)

    useEffect(() => {
        setPaidTariffToShow(paidList[0])
    }, [tariffs.length])

    ///<Link to={{ pathname: "https://example.zendesk.com/hc/en-us/articles/123456789-Privacy-Policies" }} target="_blank" />

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('prices:title')}</h2>
                {tariffs && (
                    <div className="row">
                        {free && location.pathname === '/' && (
                            <div className={`col-lg-4 ${style.col}`} key={`${free.price}`}>
                                <div className={style.card}>
                                    <div className={style.cardTitle}>{free.title}</div>
                                    <div className={style.amount}>{free.price}</div>
                                    <p className={style.desc}>{free.description}</p>
                                    <ul className={style.features}>
                                        {Array.isArray(free.features) &&
                                        free.features.map((item: string, index) => (
                                            <li className={style.item} key={index}>{item}</li>
                                        ))}
                                    </ul>
                                    <NavLink to={'/registration'} className={`btn btn-outlined`}>
                                        {t('prices:free.link_title')}
                                    </NavLink>
                                </div>
                            </div>
                        )}
                        {paidTariffToShow && (
                            <div className={`col-lg-4 ${style.col}`} key={`${paidTariffToShow.price}`}>
                                <div className={style.card}>
                                    <div className={style.top}>
                                        <div className={style.cardTitle}>{paidTariffToShow.title}</div>
                                        <select
                                            name="period"
                                            className={style.select}
                                            id="period"
                                            onChange={changeTariff}
                                        >
                                            <option value={3}>{t('prices:monthly')}</option>
                                            <option value={4}>{t('prices:annually')}</option>
                                        </select>
                                    </div>
                                    <div className={style.amount}>
                                        {paidTariffToShow.price}
                                        <span> / {t('prices:monthly')}</span>
                                    </div>
                                    <p className={style.desc}>{paidTariffToShow.description}</p>
                                    <ul className={style.features}>
                                        {Array.isArray(paidTariffToShow.features) &&
                                        paidTariffToShow.features.map((item: string, index) => (
                                            <li className={style.item} key={index}>{item}</li>
                                        ))}
                                    </ul>
                                    {!isLoggedIn
                                        ? (<NavLink to={`/registration`} className={`btn btn-outlined-yellow`}>
                                            {t('prices:paid.link_title')}
                                        </NavLink>)
                                        : (<button>Pay</button>)
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )

    function changeTariff(e: React.ChangeEvent<HTMLSelectElement>) {
        const needed = paidList.filter(item => item.id.toString() === e.target.value)
        setPaidTariffToShow(needed[0])
    }
}

export default Prices
