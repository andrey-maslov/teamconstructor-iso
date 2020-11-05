import {
    ADD_AUTH_DATA,
    CLEAR_USER_DATA,
    SET_ACTIVE_PROJECT,
    ADD_PROJECT,
    SET_PROJECTS,
} from '../actions/actionTypes'
import { loadState } from '../store/sessionStorage'

let USER_DATA = loadState('userData')

if (!USER_DATA) {
    USER_DATA = {
        firstName: null,
        lastName: null,
        username: null,
        provider: null,
        email: null,
        testResult: null,
        role: null,
        projects: null,
        activeProject: null,
        isLoggedIn: false,
        errorApiMessage: null
    }
}

export type userStoreType = typeof USER_DATA

export const user = (state = USER_DATA, {
    type,
    firstName,
    lastName,
    username,
    provider,
    email,
    testResult,
    role,
    projects,
    project,
    activeProject,
}: userStoreType) => {
    switch (type) {
        case ADD_AUTH_DATA :
            return {
                ...state,
                username,
                firstName,
                lastName,
                email,
                provider,
                testResult,
                role,
                projects,
                activeProject,
                isLoggedIn: true
            }
        case SET_ACTIVE_PROJECT :
            return {
                ...state,
                activeProject
            }
        case ADD_PROJECT :
            return {
                ...state,
                projects: [...state.projects, project]
            }
        case SET_PROJECTS :
            return {
                ...state,
                projects: projects
            }
        case CLEAR_USER_DATA :
            return {
                ...state,
                firstName: null,
                lastName: null,
                username: null,
                provider: null,
                email: null,
                testResult: null,
                role: null,
                projects: null,
                activeProject: null,
                isLoggedIn: false,
                errorApiMessage: null
            }
        default:
            return state
    }
}
