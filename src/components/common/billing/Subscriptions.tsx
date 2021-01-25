import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { refreshInvoice } from "../../../actions/api/subscriptionsAPI";
import Prices from "./prices/Prices";
import RefreshInvoice from "./RefreshInvoice";
import { globalStoreType } from "../../../constants/types";
import { isBrowser } from "../../../helper/helper";

const Subscriptions: React.FC = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)

    const [mode, setMode] = useState<'prices' | 'refresh_invoice'>('prices')

    const pathArr: string[] = location.pathname.split('/')
    const invoiceId = pathArr[pathArr.length - 1]

    useEffect(() => {
        if (invoiceId && invoiceId !== 'subscriptions' && invoiceId !== 'refreshInvoice') {
            setMode('refresh_invoice')
            refreshInvoice(invoiceId)
                .then(() => {
                    if (isBrowser) {
                        sessionStorage.removeItem('tariffIdToPay')
                        window.location.href = '/profile'
                    }
                })
                .catch(err => console.error(err))
        }
    }, [invoiceId])

    return (
        <>
            {mode === 'refresh_invoice' && <RefreshInvoice />}
            {mode === 'prices' && <Prices />}
        </>
    )
}

export default Subscriptions
