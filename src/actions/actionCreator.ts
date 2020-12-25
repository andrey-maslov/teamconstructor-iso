import {
    SET_TEAMS_DATA,
    ADD_AUTH_DATA,
    SET_ADD_MEMBER_MODAL,
    SET_CREATE_PROJECT_MODAL,
    LOADING,
    SET_EDITED_MEMBER,
    SET_ROW_DATA1,
    SET_ROW_DATA2, SET_COMPARISON_READY, COMPARISON_IN_PROCESS, SET_PAIR_DATA, CLEAR_USER_DATA,
} from './actionTypes';
import { anyType, IPairData, ITeam, IUserData } from "../constants/types"
import { removeCookie } from "../helper/cookie";

export { fetchTerms, fetchContent } from './api/termsAPI'
export { checkAuth, authUser, sendForgotEmail, sendNewPassword } from './api/accountAPI'
export { createProject, updateProject, deleteProject, fetchProjectList } from './api/projectsAPI'

/*===== AUTH =====*/

export function setUserData(data: IUserData): { type: string; userData: IUserData } {
    return {
        type: ADD_AUTH_DATA,
        userData: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            position: data.position,
            provider: data.provider,
            isPublicProfile: data.isPublicProfile,
            isOpenForWork: data.isOpenForWork
        }
    }
}

export function logOut(): { type: string } {
    removeCookie('token')
    return {
        type: CLEAR_USER_DATA,
    }
}


/*===== PAIR COOPERATION =====*/
export function setPairData(data1: anyType, data2: anyType, name1: string, name2: string): IPairData {
    return {
        type: SET_PAIR_DATA,
        data1,
        data2,
        name1,
        name2
    }
}

export function setRowData(encData1: string, encData2: string): anyType {

    if (encData1.length !== 0) {
        return {
            type: SET_ROW_DATA1,
            encData1,
        };
    } else if (encData2.length !== 0) {
        return {
            type: SET_ROW_DATA2,
            encData2,
        };
    }
    return {
        type: SET_ROW_DATA1,
    }
}

export function setComparisonResult(isComparisonResultReady: boolean): anyType {
    return (dispatch: anyType) => {
        dispatch({
            type: SET_COMPARISON_READY,
            isComparisonResultReady
        })
        dispatch({
            type: COMPARISON_IN_PROCESS,
            isComparisonInProcess: true
        })
        setTimeout(() => {
            dispatch({
                type: COMPARISON_IN_PROCESS,
                isComparisonInProcess: false
            })
        }, 1500)
    }
}


/*===== TEAM COOPERATION =====*/
export function setTeamsData(teamsData: ITeam[]): { type: string, teams: ITeam[] } {
    return {
        type: SET_TEAMS_DATA,
        teams: teamsData
    }
}


/*===== MODALS and ALERTS =====*/
export function setAddMemberModal(isAddMemberModal: boolean): { type: string, isAddMemberModal: boolean } {
    return {
        type: SET_ADD_MEMBER_MODAL,
        isAddMemberModal
    }
}

export function setEditedMember(editedMember: number | null): { type: string, editedMember: number | null } {
    return {
        type: SET_EDITED_MEMBER,
        editedMember
    }
}

export function setCreateProjectModal(isCreateProjectModal: boolean): { type: string, isCreateProjectModal: boolean } {
    return {
        type: SET_CREATE_PROJECT_MODAL,
        isCreateProjectModal
    }
}

export function setLoading(isLoading: boolean): { type: string, isLoading: boolean } {
    return {
        type: LOADING,
        isLoading
    }
}