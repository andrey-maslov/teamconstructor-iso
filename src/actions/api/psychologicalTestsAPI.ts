import axios from 'axios'
import { AnyType } from "../../constants/types"
import { getAuthConfig, testApiUrl } from "./utils"
import { SET_PSY_DATA } from "../actionTypes";

export function fetchPsyData(token: string): AnyType {
    return (dispatch: AnyType) => {
        axios(`${testApiUrl}/list`, getAuthConfig(token))
            .then(res => {
                if (res.data.length > 0) {
                    dispatch({type: SET_PSY_DATA, psyData: res.data[0].value})
                }
            })
            .catch(err => console.error(err))
    }
}