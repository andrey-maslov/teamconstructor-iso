import React from 'react'
import style from './prices.module.scss'
import { NavLink } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";

const Prices: React.FC = () => {

    const tariffs = [
        {
            title: 'Бесплатный',
            amount: 0,
            period: '',
            desc: 'Для каждого пользователя, который хочет узнать свой психологический профиль и проверить свое взаимодействие с одним партнером',
            features: [
                'Личный кабинет',
                'Парное сравнение',
                'Индивидуальный профиль',
            ],
            link: {
                title: 'Зарегистрироваться',
                route: '/registration',
                isExternal: false
            }
        },
        {
            title: 'Менеджер',
            amount: 29.99,
            period: 'в месяц',
            desc: 'Для каждого пользователя, который хочет формировать команду и оценивать эффективность командного взаимодействия',
            features: [
                'Личный кабинет',
                'Парное сравнение',
                'Индивидуальный профиль',
                'Формирование команд и проекта',
            ],
            link: {
                title: 'Оплатить',
                route: '/',
                isExternal: true
            }
        },
        {
            title: 'Руководитель',
            amount: 299.99,
            period: 'в год',
            desc: 'Для каждого пользователя, который хочет узнать свой психологический профиль и проверить свое взаимодействие с одним партнером',
            features: [
                'Личный кабинет',
                'Парное сравнение',
                'Индивидуальный профиль',
            ],
            link: {
                title: 'Оплатить',
                route: '/',
                isExternal: true
            }
        },
    ]

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>Стоимость</h2>
                <div className="row">
                    {tariffs && tariffs.map(tariff => (
                        <div className={`col-lg-4 ${style.col}`} key={tariff.title}>
                            <div className={style.card}>
                                <div className={style.cardTitle}>{tariff.title}</div>
                                <div className={style.amount}>{tariff.amount}</div>
                                <p className={style.desc}>{tariff.desc}</p>
                                <ul className={style.features}>
                                    {tariff.features && tariff.features.map((item: string, i) => (
                                        <li className={style.item} key={i}>{item}</li>
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
                                        {tariff.link.title}
                                    </a>
                                ) : (
                                    <NavLink to={tariff.link.route} className={`btn btn-outlined ${style.btn}`}>
                                        {tariff.link.title}
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