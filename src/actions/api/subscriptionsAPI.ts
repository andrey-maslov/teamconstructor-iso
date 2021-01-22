import axios from 'axios'
import { getCookieFromBrowser } from '../../helper/cookie'
import { getAuthConfig, billingApiUrl } from './utils'
import { anyType, ISubscription } from "../../constants/types";

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

