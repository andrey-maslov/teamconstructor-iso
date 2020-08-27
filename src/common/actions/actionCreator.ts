import {
    SET_PAIR_DATA,
    CLEAR_PAIR_DATA,
    SET_TEAMS_DATA,
    SET_ACTIVE_TEAM,
    SET_ROW_DATA1,
    SET_ROW_DATA2,
    ADD_AUTH_DATA,
    CLEAR_USER_DATA,
    SET_LANG,
    FETCH_TERMS,
    SET_COMPARISON_READY,
    COMPARISON_IN_PROCESS,
    SET_RANDOM,
    SET_ADD_MEMBER_MODAL,
    SET_AUTH_MODAL,
    FETCH_CONTENT,
    SET_ERROR,
    LOADING, ADD_PROJECT, SET_ACTIVE_PROJECT, SET_PROJECTS, SET_CREATE_PROJECT_MODAL, SET_EDITED_MEMBER,
} from './actionTypes';
import {ILoginData, IProject, IRegisterData, ITeam,} from "../../constants/types";
import {CONTENT_API, BASE_API} from "../../constants/constants";
import axios from 'axios'
import Cookie from "js-cookie";
import {isBrowser} from "../../helper/helper";

// const token = isBrowser ? localStorage.getItem('token') : ''
const token = Cookie.get('token')


/*
USER AUTHORIZATION
 */
export function addUserData(name: string, email: string): { type: string, name: string, email: string } {
    return {
        type: ADD_AUTH_DATA,
        name,
        email,
    };
}

export function setLanguage(language: string): { type: string, language: string } {
    return {
        type: SET_LANG,
        language,
    };
}

export function logOut(): { type: string } {
    Cookie.remove('token')
    return {
        type: CLEAR_USER_DATA,
    };
}


/*
COMPARISON PROCESS
 */

export function setComparisonProcess(isComparisonInProcess: boolean): { type: string, isComparisonInProcess: boolean } {
    return {
        type: COMPARISON_IN_PROCESS,
        isComparisonInProcess
    };
}

export function setComparisonResult(isComparisonResultReady: boolean): any {

    return (dispatch: any) => {
        dispatch({
            type: SET_COMPARISON_READY,
            isComparisonResultReady
        });
        dispatch({
            type: COMPARISON_IN_PROCESS,
            isComparisonInProcess: true
        });
        setTimeout(() => {
            dispatch({
                type: COMPARISON_IN_PROCESS,
                isComparisonInProcess: false
            })
        }, 500)
    }
}


/*
PAIR COMPARISON PROCESS
 */

export function setPairData(data1: [] | string, data2: [] | string, name1: string, name2: string): {
    type: string, data1: [] | string, data2: [] | string, name1: string, name2: string
} {
    return {
        type: SET_PAIR_DATA,
        data1,
        data2,
        name1,
        name2
    };
}

export function clearPairData(): { type: string } {
    return {
        type: CLEAR_PAIR_DATA,
    };
}

export function setRowData(encData1: string, encData2: string) {

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
    console.log('default')
    return {
        type: SET_ROW_DATA1,
    }
}


/*
TEAM COOPERATION PROCESS
 */
export function setTeamsData(teamsData: ITeam[]): { type: string, teams: ITeam[] } {
    return {
        type: SET_TEAMS_DATA,
        teams: teamsData
    };
}

export function setActiveTeam(teamIndex: number): { type: string, activeTeam: number } {
    return {
        type: SET_ACTIVE_TEAM,
        activeTeam: teamIndex
    }
}

export function setRandomNum(randomNum: number): { type: string, randomNum: number } {
    return {
        type: SET_RANDOM,
        randomNum
    }
}

/*
MODALS and ALERTS
 */
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

export function setAuthModal(isAuthModal: boolean): { type: string, isAuthModal: boolean } {
    return {
        type: SET_AUTH_MODAL,
        isAuthModal
    }
}


/*===== FETCHING DATA =====*/
export const fetchTerms = (lang: string) => {

    const url = `${CONTENT_API}/psychologies/1`;

    return (dispatch: any) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                dispatch({
                    type: FETCH_TERMS,
                    terms: data[`content_${lang}`]
                });
            });
    };
};

export const fetchContent = (lang: string) => {

    const url = `${CONTENT_API}/psychologies/3`;

    return (dispatch: any) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: FETCH_CONTENT,
                    descriptions: data[`content_${lang}`]
                });
            });
    };
};


/*===== AUTH =====*/

export function checkAuth() {
    const url = `${BASE_API}/users/me`
    return (dispatch: any) => {

        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => res.data)
                .then(data => {
                    dispatch(setUser(data.id, data.username, data.email, data.role, [], null))
                    dispatch(fetchProjectsList(token))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        }
    }
}

export const authUser = (userData: IRegisterData | ILoginData, authType: 'register' | 'login') => {

    const url = (authType === 'register') ? `${BASE_API}/auth/local/register` : `${BASE_API}/auth/local`

    return (dispatch: any) => {
        dispatch(setLoading(true))
        axios(url, {
            method: 'POST',
            data: userData,
        })
            .then(res => res.data)
            .then(data => {
                const user = data.user;
                dispatch(setUser(user.id, user.username, user.email, user.role, [], null))
                // isBrowser && localStorage.setItem('token', data.jwt)
                Cookie.set("token", data.jwt)
                dispatch(fetchProjectsList(data.jwt))
                dispatch(setAuthModal(false))
                dispatch({type: SET_ERROR, errorMessage: ''})
            })
            .catch(error => {
                apiErrorHandling(error, dispatch)
                dispatch(setLoading(false))
            })
            // .finally(() => dispatch(setLoading(false)))
    }
}

function setUser(id: number, username: string, email: string, role: any, projects: IProject[] | [], activeProject: IProject | null) {
    return {
        type: ADD_AUTH_DATA,
        id,
        username,
        email,
        role,
        projects,
        activeProject,
    }
}

/*===== APPLICATION MODE (app reducer) =====*/

export function setLoading(isLoading: boolean): { type: string, isLoading: boolean } {
    return {
        type: LOADING,
        isLoading
    }
}

/*===== PROJECTS CRUD - DB =====*/

export function createProject(title: string, teams: ITeam[]) {
    const url = `${BASE_API}/projects`

    return (dispatch: any) => {

        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'POST',
                data: {
                    title,
                    teams,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => res.data)
                .then(data => {
                    dispatch({type: ADD_PROJECT, project: {id: data.id, title: data.title}})
                    dispatch({type: SET_ACTIVE_PROJECT, activeProject: {id: data.id, title: data.title}})
                    dispatch(setTeamsData(data.teams))
                    dispatch({type: SET_ERROR, errorMessage: ''})
                    dispatch(setCreateProjectModal(false))
                })
                .catch(error => {
                    apiErrorHandling(error, dispatch)
                })
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function fetchProject(id: number) {

    const url = `${BASE_API}/projects/${id}`;

    return (dispatch: any) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.data)
                .then(data => {
                    dispatch({type: SET_ACTIVE_PROJECT, activeProject: {id: data.id, title: data.title}})
                    dispatch(setTeamsData(data.teams))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    };
}

export function updateProject(id: number, teams: ITeam[]) {
    const url = `${BASE_API}/projects/${id}`

    return (dispatch: any) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'PUT',
                data: {teams},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => res.data)
                .then(data => {
                    dispatch(setTeamsData(data.teams))
                    dispatch({type: SET_ERROR, errorMessage: ''})
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function deleteProject(id: number, projects: IProject[] | [], activeProject: IProject | null) {
    const url = `${BASE_API}/projects/${id}`

    return (dispatch: any) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => {
                    dispatch({type: SET_ACTIVE_PROJECT, activeProject})
                    dispatch({type: SET_PROJECTS, projects})
                    dispatch({type: SET_ERROR, errorMessage: ''})
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function fetchProjectsList(token: string) {

    const url = `${BASE_API}/projects`;

    return (dispatch: any) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.data)
                .then(data => {
                    const projects: IProject[] = data.map((item: any) => ({
                        id: item.id, title: item.title
                    }))
                    const activeProject = projects.length !== 0 ? projects[0] : null
                    dispatch({type: SET_ERROR, errorMessage: ''})
                    dispatch({type: SET_PROJECTS, projects})
                    dispatch({type: SET_ACTIVE_PROJECT, activeProject})
                    dispatch(setTeamsData(data[0].teams))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
        }
    };
}

/*===== UTILS =====*/

function apiErrorHandling(error: any, dispatch: any) {

    if (error.response) {
        const msg = Array.isArray(error.response.data.message) ? error.response.data.message[0].messages[0].message : error.response.data.message
        dispatch({
            type: SET_ERROR,
            errorMessage: msg
        })
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('ERROR', error.message)
    }
    console.log(error)
}