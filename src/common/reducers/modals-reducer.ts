import {
    SET_ADD_MEMBER_MODAL,
} from "../actions/actionTypes";

const APP_STATE = {
    isAddMemberModal: false,
    isStatusModal: false,
    statusType: '',
    statusContent: null as JSX.Element | null
};

type ModalsReducerType = typeof APP_STATE;

export const modalsReducer = (state = APP_STATE, {
    type,
    isAddMemberModal,

}: any) => {
    switch (type) {
        case SET_ADD_MEMBER_MODAL :
            return {
                ...state,
                isAddMemberModal,
            };
        default:
            return state;
    }
};