import {
    ADD_AUTH_DATA,
    SAVE_PERSONAL_INFO,
    COOKIES_CONSENT,
    SAVE_ANSWERS,
    LOGIN_MODAL,
    ONLY_LOGGED_MODAL,
    STATUS_MODAL,
    CLEAR_USER_DATA,
    SET_LANG,
    FETCH_TERMS,
    SAVE_RESULT,
    SAVE_TEST_DATA,
    SET_COMPARISON_READY,
    SET_USERS_RESULTS,
    CLEAR_USERS_RESULTS,
} from './actionTypes';
// import axios from "axios";
// import { REQUEST_BASE_ROUTE } from 'constants/constants';
import {AnswerType} from '../../constants/types';

export const addUserData = (name: string, email: string) => {
    return {
        type: ADD_AUTH_DATA,
        name,
        email,
    };
};

export const setLanguage = (language: string) => {
    return {
        type: SET_LANG,
        language,
    };
};

export const setComparisonResult = (isComparisonResultReady: boolean) => {
    return {
        type: SET_COMPARISON_READY,
        isComparisonResultReady
    };
};

export const setUsersResults = (userData1: [] | string, userData2: [] | string,) => {
    return {
        type: SET_USERS_RESULTS,
        userData1,
        userData2,
    };
};

export const clearUserData = (bool = true) => {
    return {
        type: CLEAR_USER_DATA,
    };
};

export const clearUsersResults = (bool = true) => {
    return {
        type: CLEAR_USERS_RESULTS,
    };
};

type AnyAnswersType = any

export const saveAnswers = (answers: Array<AnswerType> | AnyAnswersType) => {
    return {
        type: SAVE_ANSWERS,
        answers
    };
};


export const savePersonalInfo = (personalInfo: number[]) => {
    return {
        type: SAVE_PERSONAL_INFO,
        personalInfo,
    };
};

export const saveTestData = (testData: number[][]) => {
    return {
        type: SAVE_TEST_DATA,
        testData,
    };
};

export const setOnlyLoggedModal = (bool: boolean) => {
    return {
        type: ONLY_LOGGED_MODAL,
        isLoginModal: bool,
    };
};

export const setStatusModal = (bool: boolean) => {
    return {
        type: STATUS_MODAL,
        isStatusModal: bool,
    };
};

export const setCookiesConsent = (bool: boolean) => {
    return {
        type: COOKIES_CONSENT,
        isCookiesConsented: bool
    };
};

export const fetchTerms = (lang: string) => {
    const url = `/psychology_${lang}.json`;

    return (dispatch: any) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: FETCH_TERMS,
                    terms: data.terms
                });
            });
    };
};

