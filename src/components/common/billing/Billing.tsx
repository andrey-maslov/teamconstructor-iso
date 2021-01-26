import React, { useEffect, useState } from 'react'
import style from './billing.module.scss'
import { useDispatch } from 'react-redux'
import { fetchUsersBillingData, unsubscribe } from "../../../actions/api/subscriptionsAPI";
import { ISubscription, ITariffText } from "../../../constants/types";
import { RiMoneyDollarBoxFill } from 'react-icons/ri'
import { SERVICE } from "../../../constants/constants";
import { useTranslation } from "react-i18next";
import { useToasts } from 'react-toast-notifications'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { SET_TARIFF } from "../../../actions/actionTypes";
import { isBrowser } from "../../../helper/helper";

const Billing: React.FC = () => {
    const { t } = useTranslation()
    const { addToast } = useToasts()
    const dispatch = useDispatch()

    const freeTexts: ITariffText = t('prices:free', { returnObjects: true })
    const paidTexts: ITariffText = t('prices:paid', { returnObjects: true })
    const promoTexts: ITariffText = t('prices:promo', { returnObjects: true })

    const tariffs = {
        0: {
            title: freeTexts.title,
            desc: freeTexts.desc
        },
        3: {
            title: paidTexts.title,
            desc: paidTexts.desc
        },
        4: {
            title: paidTexts.title,
            desc: paidTexts.desc
        },
        5: {
            title: promoTexts.title,
            desc: promoTexts.desc
        }
    }

    const basicTariff: ISubscription = {
        id: '',
        membershipPlan: {
            id: 0,
            title: '',
            service: SERVICE,
            price: 0,
            monthCount: 0,
            description: null,
            autoSearchCount: null
        },
        startedDate: '',
        endedDate: '',
        status: 1,
        autoPayment: true
    }

    const [tariff, setTariff] = useState<ISubscription>(basicTariff)
    const { membershipPlan: mp, startedDate, endedDate, autoPayment } = tariff

    // Get current user subscriptions
    useEffect(() => {
        fetchUsersBillingData().then((data) => {
            if (Array.isArray(data)) {
                const list: ISubscription[] = data.filter((item: any) => item?.membershipPlan?.service === SERVICE && item.status === 1)
                if (list.length > 0) {
                    const currentTariff = list[0]
                    setTariff(currentTariff)
                }
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
                            <div>
                                {mp.price > 0 && <RiMoneyDollarBoxFill />}
                                <span>{tariffs[mp.id].title}</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.foot}>
                        {mp.price > 0 && (
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
                                        <span>{getRemainingTime(endedDate)}</span>
                                    </li>
                                )}
                            </ul>
                        )}
                        <div className={style.desc}>{tariffs[mp.id].desc}</div>
                    </div>
                    {mp.id !== 0 && (
                        <div className={style.refund}>
                            {`The refunds don't work once you have the subscription, but you can always `}
                            <button
                                className={style.cancel}
                                onClick={() => unsubscribeUserHandler(tariff.membershipPlan.id)}>
                                Cancel your subscription
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

    function getRemainingTime(endDate: string): string {
        const now = new Date().getTime()
        const end = new Date(endDate).getTime()
        const diff = end - now
        return `${Math.floor(diff / (86400 * 1000))}`
    }

    function unsubscribeUserHandler(planId: number): void {
        confirmAlert({
            title: 'Удаление подписки',
            message: 'Вы уверены, что хотите закрыть свою подписку?',
            buttons: [
                {
                    label: 'Нет',
                    onClick: () => null
                },
                {
                    label: 'Удалить',
                    onClick: () => unsubscribeUser(planId)
                }
            ],
            overlayClassName: "alert-overlay confirm-danger",
        });
    }

    function unsubscribeUser(id: number) {
        unsubscribe(id)
            .then(res => {
                if (res === 200) {
                    addToast('Подписка закрыта успешно', {
                        appearance: 'success',
                        autoDismiss: true
                    })
                    if(isBrowser) {
                        location.reload()
                    }
                } else {
                    addToast('Что-то пошло не так', {
                        appearance: 'error',
                        autoDismiss: true
                    })
                }
            })
    }
}

export default Billing