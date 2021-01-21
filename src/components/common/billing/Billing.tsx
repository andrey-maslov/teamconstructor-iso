import React, { useEffect, useState } from 'react'
import style from './billing.module.scss'
import { fetchUsersBillingData } from "../../../actions/api/subscriptionsAPI";
import { IMembershipPlan, ISubscription } from "../../../constants/types";
import { SERVICE } from "../../../constants/constants";

interface IBillingProps {
    service: number
}

const Billing: React.FC<IBillingProps> = ({ service }) => {

    const descriptions = {
        0: "Для каждого пользователя, который хочет узнать свой психологический профиль и проверить свое взаимодействие с одним партнером",
        3: "Для каждого пользователя, который хочет формировать команду и оценивать эффективность командного взаимодействия",
        4: "Для каждого пользователя, который хочет узнать свой психологический профиль и проверить свое взаимодействие с одним партнером",
        5: "Промо-тариф"
    }

    const basicSubscription: ISubscription = {
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

    const [subscriptions, setSubscription] = useState<ISubscription[]>([basicSubscription])

    // Get current user subscriptions
    useEffect(() => {
        fetchUsersBillingData().then((data) => {
            if (Array.isArray(data)) {
                const list = data.filter((item: any) => item?.membershipPlan?.service === service)
                list.length > 0 && setSubscription(list)
            } else {
                console.log('Error: ', data)
            }
        })
    }, [])

    return (
        <ul>
            {subscriptions.map(({membershipPlan, startedDate, endedDate, autoPayment}: ISubscription) => (
                <li key={membershipPlan.title}>
                    <div className={style.head}>
                        <div>
                            {membershipPlan.price > 0
                                ? `$${membershipPlan.price} / ${membershipPlan.title.toLowerCase()}`
                                : `$${membershipPlan.price}`}
                        </div>
                        <div>
                            {membershipPlan.price > 0
                                ? <span>{membershipPlan.title}</span>
                                : membershipPlan.title}
                        </div>
                    </div>
                    <div className={style.foot}>
                        <div>{descriptions[membershipPlan.id]}</div>
                        {membershipPlan.price > 0 && (
                            <ul>
                                {startedDate && (
                                    <li><span>Начало: </span><span>{formatDate(startedDate)}</span></li>
                                )}
                                {endedDate && (
                                    <li>Окончание: <span>{formatDate(endedDate)}</span></li>
                                )}
                                {startedDate && endedDate && (
                                    <li>
                                        <span>Осталось дней: </span>
                                        <span>{getDurationInDays(startedDate, endedDate)}</span>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </li>
            ))}
        </ul>
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

    function convertToDays(milliSeconds: number): { days: number, hours: number, minutes: number } {
        const days = Math.floor(milliSeconds / (86400 * 1000));
        milliSeconds -= days * (86400 * 1000);
        const hours = Math.floor(milliSeconds / (60 * 60 * 1000));
        milliSeconds -= hours * (60 * 60 * 1000);
        const minutes = Math.floor(milliSeconds / (60 * 1000));
        return {
            days,
            hours,
            minutes
        }
    }
}

export default Billing