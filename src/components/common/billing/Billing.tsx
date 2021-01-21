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
            {subscriptions.map((item: ISubscription) => (
                <li key={item.membershipPlan.title}>
                    <div className={style.head}>
                        <div>
                            {item.membershipPlan.price > 0
                                ? `$${item.membershipPlan.price} / ${item.membershipPlan.title.toLowerCase()}`
                                : `$${item.membershipPlan.price}`}
                        </div>
                        <div>
                            {item.membershipPlan.price > 0
                                ? <span>{item.membershipPlan.title}</span>
                                : item.membershipPlan.title}
                        </div>
                    </div>
                    <div className={style.foot}>
                        <div>{item.membershipPlan.description}</div>
                        {item.membershipPlan.price > 0 && (
                            <ul>
                                <li>Started: {item.startedDate && new Date(item.startedDate).getUTCDate()}</li>
                                {/*<li>End: {item.endedDate && new Date(item.endedDate)}</li>*/}
                                {/*<li>Left: 5 days</li>*/}
                            </ul>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default Billing