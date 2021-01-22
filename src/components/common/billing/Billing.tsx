import React, { useEffect, useState } from 'react'
import style from './billing.module.scss'
import { fetchUsersBillingData } from "../../../actions/api/subscriptionsAPI";
import { IMembershipPlan, ISubscription } from "../../../constants/types";
import { RiMoneyDollarBoxFill } from 'react-icons/ri'
import { SERVICE } from "../../../constants/constants";

interface IBillingProps {
    service: number
}

const Billing: React.FC<IBillingProps> = ({ service }) => {

    const tariffs = {
        0: {
            title: 'Бесплатный',
            desc: 'Для каждого пользователя, который хочет узнать свой психологический профиль и проверить свое взаимодействие с одним партнером'
        },
        3: {
            title: 'Менеджер',
            desc: 'Для каждого пользователя, который хочет формировать команду и оценивать эффективность командного взаимодействия'
        },
        4: {
            title: 'Менеджер',
            desc: 'Для каждого пользователя, который хочет формировать команду и оценивать эффективность командного взаимодействия'
        },
        5: {
            title: 'Промо',
            desc: 'Промо-тариф'
        }
    }

    const basicTariff: ISubscription = {
        id: "333",
        membershipPlan: {
            id: 4,
            title: "Year",
            service,
            price: 199.99,
            monthCount: 12,
            description: null,
            autoSearchCount: null
        },
        startedDate: "2021-01-20T17:05:28.970Z",
        endedDate: "2022-01-19T17:05:28.970Z",
        status: 1,
        autoPayment: true
    }

    const [tariff, setTariff] = useState<ISubscription>(basicTariff)
    const { membershipPlan: mp, startedDate, endedDate, autoPayment } = tariff

    // Get current user subscriptions
    useEffect(() => {
        fetchUsersBillingData().then((data) => {
            if (Array.isArray(data)) {
                const list = data.filter((item: any) => item?.membershipPlan?.service === service)
                list.length > 0 && setTariff(list[0])
            } else {
                console.log('Error: ', data)
            }
        })
    }, [])

    return (
        <div className={style.wrapper}>
            {mp && (
                <div className={style.plan}>
                    <div className={style.head}>
                        <div className={style.price}>
                            {mp.price > 0
                                ? `$${mp.price} / ${mp.title.toLowerCase()}`
                                : `$${mp.price}`}
                        </div>
                        <div className={style.title}>
                            <div>{mp.price && <RiMoneyDollarBoxFill />}<span>{tariffs[mp.id].title}</span></div>
                        </div>
                    </div>
                    <div className={style.foot}>
                        {mp.price && (
                            <ul className={style.list}>
                                {startedDate && (
                                    <li className={style.item}>
                                        <span>Начало: </span>
                                        <span>{formatDate(startedDate)}</span>
                                    </li>
                                )}
                                {endedDate && (
                                    <li className={style.item}>
                                        <span>Окончание:</span>
                                        <span>{formatDate(endedDate)}</span>
                                    </li>
                                )}
                                {startedDate && endedDate && (
                                    <li className={style.item}>
                                        <span>Осталось дней: </span>
                                        <span>{getDurationInDays(startedDate, endedDate)}</span>
                                    </li>
                                )}
                            </ul>
                        )}
                        <div className={style.desc}>{tariffs[mp.id].desc}</div>
                    </div>
                    {mp.id !== 0 && (
                        <div className={style.refund}>
                            {`The refunds don't work once you have the subscription, but you can always `}
                            <button className={style.cancel} onClick={() => alert('вы хотите отписаться?')}>Cancel your
                                subscription
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )

    function formatDate(dateString: string): string {
        const date = new Date(dateString)
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }

    function getDurationInDays(startDate: string, endDate: string): string {
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()
        const diff = end - start
        return `${Math.floor(diff / (86400 * 1000))}`
    }
}

export default Billing