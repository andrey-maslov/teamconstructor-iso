import React from 'react'
import style from './prices.module.scss'
import { NavLink } from 'react-router-dom'
import { FiExternalLink } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

interface IText { title: string, period: string, desc: string, features: string[], link_title: string }
interface ITariff { amount: number, link: { route: string, isExternal: boolean } }
const tariffs: ITariff[] = [
    {
        amount: 0,
        link: {
            route: '/registration',
            isExternal: false
        }
    },
    {
        amount: 29.99,
        link: {
            route: '/',
            isExternal: true
        }
    },
    {
        amount: 299.99,
        link: {
            route: '/',
            isExternal: true
        }
    },
]

const Prices: React.FC = () => {

    const { t } = useTranslation()

    const texts: IText[] = t('landing:prices.tariffs', { returnObjects: true })

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('landing:prices.title')}</h2>
                <div className="row">
                    {tariffs && tariffs.map((tariff, i) => (
                        <div className={`col-lg-4 ${style.col}`} key={`${tariff.amount}`}>
                            <div className={style.card}>
                                <div className={style.cardTitle}>{texts[i].title}</div>
                                <div className={style.amount}>{tariff.amount}</div>
                                <p className={style.desc}>{texts[i].desc}</p>
                                <ul className={style.features}>
                                    {texts[i].features && texts[i].features.map((item: string, index) => (
                                        <li className={style.item} key={index}>{item}</li>
                                    ))}
                                </ul>
                                {tariff.link.isExternal ? (
                                    <a
                                        className={`btn btn-outlined ${style.btn}`}
                                        href={tariff.link.route}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FiExternalLink />
                                        {texts[i].link_title}
                                    </a>
                                ) : (
                                    <NavLink to={tariff.link.route} className={`btn btn-outlined ${style.btn}`}>
                                        {texts[i].link_title}
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Prices
