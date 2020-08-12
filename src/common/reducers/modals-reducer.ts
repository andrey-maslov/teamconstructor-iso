import {
    SET_ADD_MEMBER_MODAL,
    SET_AUTH_MODAL,
} from "../actions/actionTypes";

const APP_STATE = {
    isAddMemberModal: false,
    isAuthModal: false,
    isStatusModal: false,
    statusType: '',
    statusContent: null as JSX.Element | null
};

type ModalsReducerType = typeof APP_STATE;

export const modalsReducer = (state = APP_STATE, {
    type,
    isAddMemberModal,
    isAuthModal,
}: any) => {
    switch (type) {
        case SET_ADD_MEMBER_MODAL :
            return {
                ...state,
                isAddMemberModal,
            };
        case SET_AUTH_MODAL :
            return {
                ...state,
                isAuthModal,
            };
        default:
            return state;
    }
};