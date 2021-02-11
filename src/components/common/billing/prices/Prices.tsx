import React, { useState, useEffect } from 'react'
import style from './prices.module.scss'
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { globalStoreType, ITariffText } from "../../../../constants/types";
import Button from "../../buttons/button/Button";
import { subscribe } from "../../../../actions/api/subscriptionsAPI";
import { isBrowser } from "../../../../helper/helper";
import { BsBuilding } from "react-icons/bs"

const Prices: React.FC = () => {

    const { t } = useTranslation()
    const location = useLocation()
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)

    const tariffFromStorage = isBrowser && sessionStorage.getItem('tariffIdToPay')
    const initialTariff = (isBrowser && tariffFromStorage) ? +tariffFromStorage : 3

    const [tariffId, setTariffId] = useState<number>(initialTariff)
    const [tariffToBuy, setTariffToBuy] = useState<number>(0)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        if (tariffToBuy) {
            subscribe(tariffToBuy)
                .then((data) => {
                    if (typeof data !== 'number' && data.formUrl && isBrowser) {
                        window.open(data.formUrl, "_blank")
                    } else if (data === 400) {
                        setError('You already have the same active subscription')
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setTariffToBuy(0))
        }
    }, [tariffToBuy])

    const tariffs: { price: number, period?: string }[] = [
        {
            price: 0,
        },
        {
            price: tariffId === 3 ? 29.99 : 199.99,
            period: tariffId === 3 ? t('prices:per_month') : t('prices:per_year')
        }
    ]

    const freeTexts: ITariffText = t('prices:free', { returnObjects: true })
    const paidTexts: ITariffText = t('prices:paid', { returnObjects: true })
    const corporateTexts: ITariffText = t('prices:corporate', { returnObjects: true })

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('prices:title')}</h2>
                {tariffs && (
                    <div className="row">
                        {location.pathname === '/' && freeTexts && (
                            <div className={`col-lg-4 ${style.col}`}>
                                <div className={style.card}>
                                    <div className={style.cardTitle}>{freeTexts.title}</div>
                                    <div className={style.amount}>{tariffs[0].price}</div>
                                    <p className={style.desc}>{freeTexts.desc}</p>
                                    <ul className={style.features}>
                                        {Array.isArray(freeTexts.features) &&
                                        freeTexts.features.map((item: string) => (
                                            <li className={style.item} key={item}>{item}</li>
                                        ))}
                                    </ul>
                                    <NavLink to={'/registration'} className={`btn btn-outlined`}>
                                        {freeTexts.link_title}
                                    </NavLink>
                                </div>
                            </div>
                        )}
                        {paidTexts && <div className={`col-lg-4 ${style.col}`}>
                            <div className={style.card}>
                                <div className={style.top}>
                                    <div className={style.cardTitle}>{paidTexts.title}</div>
                                    <select
                                        name="period"
                                        className={style.select}
                                        id="period"
                                        defaultValue={tariffId}
                                        onChange={(e) => setTariffId(+e.target.value)}
                                    >
                                        <option value={3}>{t('prices:monthly')}</option>
                                        <option value={4}>{t('prices:annually')}</option>
                                    </select>
                                </div>
                                <div className={style.amount}>
                                    {tariffs[1].price}
                                    <span> / {tariffs[1].period}</span>
                                </div>
                                <p className={style.desc}>{paidTexts.desc}</p>
                                <ul className={style.features}>
                                    {Array.isArray(paidTexts.features) &&
                                    paidTexts.features.map((item: string) => (
                                        <li className={style.item} key={item}>{item}</li>
                                    ))}
                                </ul>
                                {!isLoggedIn
                                    ? (
                                        <NavLink
                                            to={`/registration`}
                                            className={`btn btn-outlined-yellow ${style.btn}`}
                                            onClick={() => rememberTariffToPay(tariffId)}
                                        >
                                            {t('prices:paid.link_title')}
                                        </NavLink>
                                    )
                                    : <Button
                                        title={t('prices:paid.link_title')}
                                        handle={() => setTariffToBuy(tariffId)}
                                        startIcon={null}
                                        btnClass={`btn btn-outlined-yellow ${style.btn}`}
                                    />
                                }
                                {error && <div className="danger">{error}</div>}
                            </div>
                        </div>}
                        {corporateTexts && (
                            <div className={`col-lg-4 ${style.col}`}>
                                <div className={style.card}>
                                    <div className={style.top}>
                                        <div className={style.cardTitle}>{corporateTexts.title}</div>
                                        <BsBuilding />
                                    </div>
                                    {/*<div className={style.amount}>{tariffs[0].price}</div>*/}
                                    <p className={style.desc}>{corporateTexts.desc}</p>
                                    <ul className={style.features}>
                                        {Array.isArray(corporateTexts.features) &&
                                        corporateTexts.features.map((item: string) => (
                                            <li className={style.item} key={item}>{item}</li>
                                        ))}
                                    </ul>
                                    <a href="mailto:contact@teamconstructor.com" className={`btn btn-outlined`}>
                                        {corporateTexts.link_title}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )

    function rememberTariffToPay(id: number): void {
        if (isBrowser) {
            sessionStorage.setItem('tariffIdToPay', `${id}`)
        }
    }
}

export default Prices
