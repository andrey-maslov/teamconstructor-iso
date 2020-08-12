import {
    ADD_AUTH_DATA,
    SUBSCRIPTION,
    COOKIES_CONSENT,
    CLEAR_USER_DATA,
    SET_LANG, SET_ERROR, CLEAR_ERROR,
} from '../actions/actionTypes';
import { loadState } from '../store/sessionStorage';

let USER_DATA = loadState('userData');

if (!USER_DATA) {
    USER_DATA = {
        id: null,
        username: '',
        email: '',
        role: null,
        token: '',
        isLoggedIn: false,
        isSubscribed: false,
        language: '',
        isCookiesConsented: false,
        errorMessage: ''
    };
}

export type UserDataType = typeof USER_DATA;

export const userData = (state = USER_DATA, {
    id,
    role,
    type,
    username,
    email,
    token,
    isLoggedIn,
    errorMessage,
    isSubscribed,
    language,
    isCookiesConsented,
}: UserDataType) => {
    switch (type) {

        case ADD_AUTH_DATA :
            return {
                ...state,
                id,
                username,
                email,
                role,
                token,
                isLoggedIn: true
            };
        case SUBSCRIPTION :
            return {
                ...state,
                isSubscribed
            };
        case COOKIES_CONSENT :
            return {
                ...state,
                isCookiesConsented,
            };
        case SET_LANG :
            return {
                ...state,
                language
            };
        case SET_ERROR :
            return {
                ...state,
                errorMessage
            };
        case CLEAR_ERROR :
            return {
                ...state,
                errorMessage: ''
            };
        case CLEAR_USER_DATA :
            return {
                ...state,
                id: null,
                username: '',
                email: '',
                role: null,
                token: '',
                isLoggedIn: false,
                isUserInBase: false,
                isSubscribed: false,
            };
        default:
            return state;
    }
};