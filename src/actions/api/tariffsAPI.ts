import axios from 'axios'
import { tariffsApiUrl } from './utils'
import { ITariff } from "../../constants/types";

// All tariff plans of all services
export async function fetchTariffsData(): Promise<ITariff[] | number> {
    try {
        const response = await axios(`${tariffsApiUrl}/list`)
        return response.data
    } catch (err) {
        if(err.response && err.response.status) {
            return err.response.status
        }
        return 0
    }
}
