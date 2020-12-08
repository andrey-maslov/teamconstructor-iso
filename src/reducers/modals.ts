import {
    SET_ADD_MEMBER_MODAL,
    SET_CREATE_PROJECT_MODAL,
    SET_MEMBER_INFO_MODAL,
    DANGER_MODAL,
} from "../actions/actionTypes"
import { AnyType } from "../constants/types"

const APP_STATE = {
    isAddMemberModal: false,
    isCreateProjectModal: false,
    isMemberInfoModal: false,
    isDangerModal: false,
}

export type modalsStoreType = typeof APP_STATE

export const modals = (state = APP_STATE, {
    type,
    isAddMemberModal,
    isCreateProjectModal,
    isMemberInfoModal,
    isDangerModal
}: AnyType): AnyType => {
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
        case DANGER_MODAL:
            return {
                ...state,
                isDangerModal
            }
        default:
            return state
    }
}
