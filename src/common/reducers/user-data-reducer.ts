import {
    ADD_AUTH_DATA,
    SUBSCRIPTION,
    COOKIES_CONSENT,
    CLEAR_USER_DATA,
    USER_IN_BASE,
    SET_LANG,
    SAVE_RESULT,
    SAVE_TEST_DATA,
    SAVE_PERSONAL_INFO,
} from '../actions/actionTypes';
import { loadState } from '../store/sessionStorage';


let USER_DATA = loadState('userData');

if (!USER_DATA) {
    USER_DATA = {
        name: 'testName',
        email: '',
        isLoggedIn: true,
        isUserInBase: false,
        isSubscribed: false,
        language: '',
        isCookiesConsented: false,
        personalInfo: [],
        testData: [],
    };
}

export type UserDataType = typeof USER_DATA;

export const userData = (state = USER_DATA, {
    type,
    name,
    email,
    isLoggedIn,
    isUserInBase,
    isSubscribed,
    language,
    isCookiesConsented,
    personalInfo, testData,
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
        case USER_IN_BASE :
            return {
                ...state,
                isUserInBase
            };
        case SET_LANG :
            return {
                ...state,
                language
            };
        case SAVE_PERSONAL_INFO :
            return {
                ...state,
                personalInfo
            };
        case SAVE_TEST_DATA :
            return {
                ...state,
                testData
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