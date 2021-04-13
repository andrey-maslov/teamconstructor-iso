import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import style from './billing.module.scss'
import { changeAutoRenewal, fetchUsersBillingData, unsubscribe } from '../../../actions/api/subscriptionsAPI'
import { ISubscription, ITariffText } from '../../../constants/types'
import { RiMoneyDollarBoxFill } from 'react-icons/ri'
import { SERVICE } from '../../../constants/constants'
import { useTranslation } from 'react-i18next'
import { useToasts } from 'react-toast-notifications'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { isBrowser } from '../../../helper/helper'
import Checkbox from '../Inputs/checkbox/Checkbox'
import { NavLink } from 'react-router-dom'

const Billing: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { addToast } = useToasts()
    const { register, handleSubmit, errors } = useForm<{ mode: boolean }>()

    const pdfLink = i18n.language === 'ru'
        ? 'teamconstructor_руководство_пользователя.pdf'
        : 'teamconstructor_user_manual.pdf'

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

    const [refreshTariffData, setRefreshTariffData] = useState(true)

    // Get current user subscriptions
    useEffect(() => {
        if (refreshTariffData) {
            fetchUsersBillingData()
                .then((data) => {
                    if (Array.isArray(data)) {
                        const list: ISubscription[] = data.filter((item: ISubscription) => (
                            item?.membershipPlan?.service === SERVICE && item.status === 1
                        ))
                        if (list.length > 0) {
                            const currentTariff = list[0]
                            setTariff(currentTariff)
                        }
                    } else {
                        console.log('Error: ', data)
                    }
                })
                .finally(() => setRefreshTariffData(false))
        }
    }, [refreshTariffData])

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
                                        <span>{t('common:billing.start')}: </span>
                                        <span>{formatDate(startedDate)}</span>
                                    </li>
                                )}
                                {endedDate && (
                                    <li className={style.item}>
                                        <span>{t('common:billing.end')}:</span>
                                        <span>{formatDate(endedDate)}</span>
                                    </li>
                                )}
                                {startedDate && endedDate && (
                                    <li className={style.item}>
                                        <span>{t('common:billing.remains')}: </span>
                                        <span>{getRemainingTime(endedDate)}</span>
                                    </li>
                                )}
                            </ul>
                        )}
                        <div className={style.desc}>{tariffs[mp.id].desc}</div>
                    </div>
                    {mp.id !== 0 && (
                        <div className={style.refund}>
                            {`${t('common:billing.refund_msg')} `}
                            <button
                                className={style.cancel}
                                onClick={() => unsubscribeUserHandler(tariff.membershipPlan.id)}>
                                {t('common:billing.cancel_btn')}
                            </button>
                        </div>
                    )}

                    {// todo check paid tariff plans
                        (mp.id === 3 || mp.id === 4) && (
                            <div className={style.renewal}>
                                <Checkbox
                                    isChecked={autoPayment}
                                    handle={renewalHandle}
                                    label={t('common:billing.activate_auto_renewal')}
                                    {...{
                                        name: 'mode'
                                    }}
                                />
                                <p style={{ marginLeft: '33px', fontSize: '100%' }}>
                                    {t('common:billing.auto_renewal_terms_pre')}
                                    {' '}
                                    <NavLink to="/automatic-renewal-terms">
                                        {t('common:billing.auto_renewal_terms_link')}
                                    </NavLink>
                                    {`, ${t('common:billing.agree_with')} `}
                                    <NavLink to="/terms">
                                        {t('common:billing.terms')}
                                    </NavLink>
                                    {` ${t('common:billing.and')} `}
                                    <a href={`/documents/${pdfLink}`} target="_blank" rel="noreferrer">
                                        {t('common:billing.user_manual')}
                                    </a>
                                </p>
                            </div>
                        )}
                </div>
            )}
        </div>
    )

    // TODO handle and display errors
    function renewalHandle(e: React.ChangeEvent<HTMLInputElement>): void {
        changeAutoRenewal(mp.id, e.target.checked)
            .then((data) => {
                if (data === 200 && 201) {
                    setRefreshTariffData(true)
                } else {
                    console.log('Error')
                }
            })
            .finally(() => setRefreshTariffData(true))
    }

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
            title: t('common:billing.cancel_modal_title'),
            message: t('common:billing.cancel_modal_confirm'),
            buttons: [
                {
                    label: t('common:confirm.no'),
                    onClick: () => null
                },
                {
                    label: t('common:confirm.cancel'),
                    onClick: () => unsubscribeUser(planId)
                }
            ],
            overlayClassName: 'alert-overlay confirm-danger'
        })
    }

    function unsubscribeUser(id: number) {
        unsubscribe(id)
            .then(res => {
                if (res === 200) {
                    addToast(t('common:errors.cancel_success'), {
                        appearance: 'success',
                        autoDismiss: true
                    })
                    if (isBrowser) {
                        location.reload()
                    }
                } else {
                    addToast(t('common:errors.something_wrong'), {
                        appearance: 'error',
                        autoDismiss: true
                    })
                }
            })
    }
}

export default Billing
