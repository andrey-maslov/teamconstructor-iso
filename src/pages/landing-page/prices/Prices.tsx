import React, {useState} from 'react'
import style from './prices.module.scss'
import {NavLink} from 'react-router-dom'
import {FiExternalLink} from 'react-icons/fi'
import {useTranslation} from 'react-i18next'

interface ITariffText {
    title: string,
    period?: string,
    desc: string,
    features: string[],
    link_title: string
}

interface ITariff {
    amount: number,
    tariff: string
    period?: string
}

const Prices: React.FC = () => {

    const {t} = useTranslation()
    const [tariff, setTariff] = useState("teamconstructor-month")

    const tariffs: ITariff[] = [
        {
            amount: 0,
            tariff: "free",
        },
        {
            amount: tariff === "teamconstructor-month" ? 29.99 : 299.99,
            tariff: tariff,
            period: tariff === "teamconstructor-month" ? t('landing:prices.per_month') : t('landing:prices.per_year')
        }
    ]

    const free_texts: ITariffText = t('landing:prices.free', {returnObjects: true})
    const paid_texts: ITariffText = t('landing:prices.paid', {returnObjects: true})


    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('landing:prices.title')}</h2>
                {tariffs && (
                    <div className="row">
                        <div className={`col-lg-4 ${style.col}`} key={`${tariffs[0].amount}`}>
                            <div className={style.card}>
                                <div className={style.cardTitle}>{free_texts.title}</div>
                                <div className={style.amount}>{tariffs[0].amount}</div>
                                <p className={style.desc}>{free_texts.desc}</p>
                                <ul className={style.features}>
                                    {free_texts.features && free_texts.features.map((item: string, index) => (
                                        <li className={style.item} key={index}>{item}</li>
                                    ))}
                                </ul>
                                <NavLink to={'/registration'} className={`btn btn-outlined`}>
                                    {free_texts.link_title}
                                </NavLink>
                            </div>
                        </div>
                        <div className={`col-lg-4 ${style.col}`} key={`${tariffs[1].amount}`}>
                            <div className={style.card}>
                                <div className={style.top}>
                                    <div className={style.cardTitle}>{paid_texts.title}</div>
                                    <select
                                        name="period"
                                        className={style.select}
                                        id="period"
                                        onChange={(e) => setTariff(e.target.value)}
                                    >
                                        <option value="teamconstructor-month">{t('landing:prices.monthly')}</option>
                                        <option value="teamconstructor-year">{t('landing:prices.annually')}</option>
                                    </select>
                                </div>
                                <div className={style.amount}>
                                    {tariffs[1].amount}
                                    <span> / {tariffs[1].period}</span>
                                </div>
                                <p className={style.desc}>{paid_texts.desc}</p>
                                <ul className={style.features}>
                                    {paid_texts.features && paid_texts.features.map((item: string, index) => (
                                        <li className={style.item} key={index}>{item}</li>
                                    ))}
                                </ul>
                                <NavLink to={`/registration?tariff=${tariff}`} className={`btn btn-outlined-yellow`}>
                                    {paid_texts.link_title}
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Prices
