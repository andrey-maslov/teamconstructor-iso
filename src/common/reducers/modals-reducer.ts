import {
    COOKIES_CONSENT,
    SET_ADD_MEMBER_MODAL,
    SET_AUTH_MODAL, SET_CREATE_PROJECT_MODAL,
} from "../actions/actionTypes";

const APP_STATE = {
    isAddMemberModal: false,
    isCreateProjectModal: false,
    isAuthModal: false,
    isCookiesConsented: false,
};

type ModalsReducerType = typeof APP_STATE;

export const modalsReducer = (state = APP_STATE, {
    type,
    isAddMemberModal,
    isCreateProjectModal,
    isAuthModal,
    isCookiesConsented,
}: any) => {
    switch (type) {
        case SET_ADD_MEMBER_MODAL :
            return {
                ...state,
                isAddMemberModal,
            };
        case SET_CREATE_PROJECT_MODAL :
            return {
                ...state,
                isCreateProjectModal,
            };
        case SET_AUTH_MODAL :
            return {
                ...state,
                isAuthModal,
            };
        case COOKIES_CONSENT :
            return {
                ...state,
                isCookiesConsented,
            };
        default:
            return state;
    }
};