import {
    SET_ADD_MEMBER_MODAL,
    SET_CREATE_PROJECT_MODAL, SET_MEMBER_INFO_MODAL,
} from "../actions/actionTypes"

const APP_STATE = {
    isAddMemberModal: false,
    isCreateProjectModal: false,
    isMemberInfoModal: false,
}

export type modalsStoreType = typeof APP_STATE

export const modals = (state = APP_STATE, {
    type,
    isAddMemberModal,
    isCreateProjectModal,
    isMemberInfoModal,
}: any) => {
    switch (type) {
        case SET_ADD_MEMBER_MODAL :
            return {
                ...state,
                isAddMemberModal,
            }
        case SET_CREATE_PROJECT_MODAL :
            return {
                ...state,
                isCreateProjectModal,
            }
        case SET_MEMBER_INFO_MODAL :
            return {
                ...state,
                isMemberInfoModal,
            }
        default:
            return state
    }
}
