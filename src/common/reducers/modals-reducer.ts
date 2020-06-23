import {
    LOGIN_MODAL,
    ONLY_LOGGED_MODAL,
    STATUS_MODAL,
} from "../actions/actionTypes";

const APP_STATE = {
    type: '',
    isLoginModal: false,
    isOnlyLoggedModal: false,
    isStatusModal: false,
    statusType: '',
    statusContent: null as JSX.Element | null
};

type ModalsReducerType = typeof APP_STATE;

export const modalsReducer = (state = APP_STATE, {
    type,
    isLoginModal,
    isOnlyLoggedModal,
    isStatusModal,
    statusType,
    statusContent,
}: ModalsReducerType) => {
    switch (type) {
        case LOGIN_MODAL :
            return {
                ...state,
                isLoginModal,
            };
        case ONLY_LOGGED_MODAL :
            return {
                ...state,
                isOnlyLoggedModal,
            };
        case STATUS_MODAL :
            return {
                ...state,
                isStatusModal,
                statusType,
                statusContent,
            };
        default:
            return state;
    }
};