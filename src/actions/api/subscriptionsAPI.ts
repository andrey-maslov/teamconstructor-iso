import axios from 'axios'
import { getCookieFromBrowser } from '../../helper/cookie'
import { getAuthConfig, billingApiUrl } from './utils'
import { anyType, ISubscription } from "../../constants/types";

export interface ISubscribeResponse {
    orderId: string,
    formUrl: string
}

export interface IInvoiceData {
    createdDate: string,
    amount: number,
    currency: string,
    description: string,
    status: number,
    canceledReason: string | null,
    aBankOrderId: string,
    aBankFormUrl:  string
}

export async function fetchUsersBillingData(): Promise<ISubscription[] | number> {
    const token = getCookieFromBrowser('token')
    try {
        const response = await axios(`${billingApiUrl}/list`, getAuthConfig(token))
        const { data } = response
        return data
    } catch (err) {
        if(err.response && err.response.status) {
            return err.response.status
        }
        return 0
    }
}

export async function subscribe(planId: number): Promise<ISubscribeResponse | number> {
    const token = getCookieFromBrowser('token')
    try {
        const response = await axios.post(`${billingApiUrl}/subscribe/${planId}`, {}, getAuthConfig(token))
        const { data } = response
        return data
    } catch (err) {
        if(err.response && err.response.status) {
            return err.response.status
        }
        return 0
    }
}

export async function refreshInvoice(invoiceId: string): Promise<IInvoiceData | number> {
    const token = getCookieFromBrowser('token')
    try {
        const response = await axios.post(`${billingApiUrl}/refreshInvoice/${invoiceId}`, {}, getAuthConfig(token))
        const { data } = response
        return data
    } catch (err) {
        if(err.response && err.response.status) {
            return err.response.status
        }
        return 0
    }
}

export async function unsubscribe(planId: number): Promise<number> {
    const token = getCookieFromBrowser('token')
    try {
        const response = await axios.post(`${billingApiUrl}/unsubscribe/${planId}`, {}, getAuthConfig(token))
        return response.status
    } catch (err) {
        if(err.response && err.response.status) {
            return err.response.status
        }
        return 0
    }
}

