import {SET_FOUND_USER_DATA, CLEAR_FOUND_USER_DATA} from '../actions/actionTypes'
import { anyType } from "../constants/types"


export type UserDataType = {
    "email": string,
    "firstName": string,
    "lastName": string,
    "position": string,
    "isPublicProfile": boolean,
    "isOpenForWork": boolean,
    "tests": [
        {
            "id": number,
            "userId": string,
            "value": string,
            "type": number
        }
    ]
}

type SearchReducerType = {
    type: string
    foundUserData: UserDataType | null
}

const STATE = {
    foundUserData: null,
}

export const search = (state = STATE, { type, foundUserData }: SearchReducerType): anyType => {
    switch (type) {
        case SET_FOUND_USER_DATA:
            return {
                ...state,
                foundUserData
            }
        case CLEAR_FOUND_USER_DATA:
            return {
                ...state,
                foundUserData: null
            }
        default:
            return state
    }
}
