import { ADD_AUTH_DATA, CLEAR_USER_DATA, SET_AUTH_PROVIDER, SET_PSY_DATA } from '../actions/actionTypes'
import { loadState } from '../store/sessionStorage'
import { anyType, IUserData } from "../constants/types"

// let STATE = loadState('userData')

export type userStoreType = {
    firstName: string | null
    lastName: string | null
    email: string | null
    emailConfirmed: boolean
    position: string | null
    psyData: string | null
    provider: string | null
    isPublic: boolean | null
    isLookingForJob: boolean | null
    isOpenForWork: boolean | null
}

type UserReducerType = {
    type: string
    userData: IUserData
    provider: string
    psyData: string
}

const STATE = {
    firstName: null,
    lastName: null,
    email: null,
    emailConfirmed: false,
    position: null,
    psyData: null,
    provider: null,
    isLoggedIn: false,
    isPublicProfile: null,
    isOpenForWork: null
}

export const user = (state = STATE, { type, userData, provider, psyData }: UserReducerType): anyType => {
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
        case SET_PSY_DATA:
            return {
                ...state,
                psyData
            }
        case CLEAR_USER_DATA:
            return {
                ...state,
                firstName: null,
                lastName: null,
                email: null,
                emailConfirmed: false,
                position: null,
                psyData: null,
                provider: null,
                isLoggedIn: false,
                isPublicProfile: null,
                isOpenForWork: null
            }
        default:
            return state
    }
}
