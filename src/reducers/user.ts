import { ADD_AUTH_DATA, CLEAR_USER_DATA, SET_AUTH_PROVIDER } from '../actions/actionTypes'
import { loadState } from '../store/sessionStorage'
import { AnyType, IUserData } from "../constants/types"

let STATE = loadState('userData')

export type userStoreType = {
    firstName: string | null
    lastName: string | null
    email: string | null
    position: string | null
    provider: string | null
    isPublic: boolean | null
    isLookingForJob: boolean | null
    isOpenForWork: boolean | null
}

type UserReducerType = {
    type: string
    userData: IUserData
    provider: string
}

if (!STATE) {
    STATE = {
        firstName: null,
        lastName: null,
        email: null,
        position: null,
        provider: null,
        isLoggedIn: false,
        isPublicProfile: null,
        isOpenForWork: null
    }
}

export const user = (state = STATE, {type, userData, provider}: UserReducerType): AnyType => {
    switch (type) {
        case ADD_AUTH_DATA :
            return {
                ...state,
                ...userData,
                isLoggedIn: true
            }
        case SET_AUTH_PROVIDER:
            return {
                ...state,
                provider
            }
        case CLEAR_USER_DATA:
            return {
                ...state,
                firstName: null,
                lastName: null,
                email: null,
                position: null,
                provider: null,
                isLoggedIn: false,
                isPublicProfile: null,
                isOpenForWork: null
            }
        default:
            return state
    }
}
