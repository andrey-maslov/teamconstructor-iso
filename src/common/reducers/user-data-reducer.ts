import {
    ADD_AUTH_DATA,
    SUBSCRIPTION,
    COOKIES_CONSENT,
    CLEAR_USER_DATA,
    SET_LANG,
} from '../actions/actionTypes';
import { loadState } from '../store/sessionStorage';


let USER_DATA = loadState('userData');

if (!USER_DATA) {
    USER_DATA = {
        name: 'testName',
        email: '',
        isLoggedIn: true,
        isSubscribed: false,
        language: '',
        isCookiesConsented: false,
    };
}

export type UserDataType = typeof USER_DATA;

export const userData = (state = USER_DATA, {
    type,
    name,
    email,
    isLoggedIn,
    isSubscribed,
    language,
    isCookiesConsented,
}: UserDataType) => {
    switch (type) {

        case ADD_AUTH_DATA :
            return {
                ...state,
                name,
                email,
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
        case CLEAR_USER_DATA :
            return {
                ...state,
                name: '',
                email: '',
                isLoggedIn: false,
                isUserInBase: false,
                isSubscribed: false,
            };

        default:
            return state;
    }
};