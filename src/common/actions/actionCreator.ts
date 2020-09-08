import {
    SET_PAIR_DATA,
    CLEAR_PAIR_DATA,
    SET_TEAMS_DATA,
    SET_POOL,
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
    PROCESS_FAILED,
    LOADING,
    ADD_PROJECT,
    SET_ACTIVE_PROJECT,
    SET_PROJECTS,
    SET_CREATE_PROJECT_MODAL,
    SET_EDITED_MEMBER, SEND_EMAIL, CHANGE_PWD,
} from './actionTypes';
import {ILoginData, IProject, ISignUpData, ITeam,} from "../../constants/types"
import {CONTENT_API, BASE_API, authModes} from "../../constants/constants"
import axios from 'axios'
import Cookie from "js-cookie"
import {IForgotForm} from "../components/common/auth/Forgot";
import {IResetForm} from "../components/common/auth/Reset";

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
export function setLanguage(language: string): { type: string, language: string } {
    Cookie.set("i18next", language)
    return {
        type: SET_LANG,
        language,
    };
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

export function checkAuth() {
    const url = `${BASE_API}/users/me`
    const token = Cookie.get('token')

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

export const authUser = (userData: ISignUpData | ILoginData, authType: keyof typeof authModes) => {

    const url = (authType === authModes[1]) ? `${BASE_API}/auth/local/register` : `${BASE_API}/auth/local`

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
                dispatch(clearErrors())
            })
            .catch(error => {
                apiErrorHandling(error, dispatch)
                dispatch(setLoading(false))
            })
    }
}


export const sendForgotEmail = (email: string) => {

    const url = `${BASE_API}/auth/forgot-password`

    return (dispatch: any) => {
        dispatch(setLoading(true))
        axios(url, {
            method: 'POST',
            data: {email},
        })
            .then(res => res.data)
            .then(data => {
                console.log('OK')
                // dispatch(clearErrors())
                // dispatch({type: SEND_EMAIL, emailSent: true})
            })
            .catch(error => {
                console.log('ERROR email')
                apiErrorHandling(error, dispatch)
            })
            .finally(() => dispatch(setLoading(false)))
    }
}


export const sendNewPassword = (data: { code: string, password: string, passwordConfirmation: string }) => {

    const url = `${BASE_API}/auth/reset-password`

    return (dispatch: any) => {
        dispatch(setLoading(true))
        axios(url, {
            method: 'POST',
            data: data,
        })
            .then(res => res.data)
            .then(data => {
                dispatch(clearErrors())
                dispatch({type: CHANGE_PWD, isPwdChanged: true})
            })
            .catch(error => {
                apiErrorHandling(error, dispatch)
            })
            .finally(() => dispatch(setLoading(false)))
    }
}


export function logOut(): { type: string } {
    Cookie.remove('token')
    return {
        type: CLEAR_USER_DATA,
    };
}

/*===== APPLICATION MODE (app reducer) =====*/

export function setLoading(isLoading: boolean): { type: string, isLoading: boolean } {
    return {
        type: LOADING,
        isLoading
    }
}

/*===== PROJECTS CRUD - DB =====*/

export function createProject(title: string, pool: ITeam, teams: ITeam[]) {
    const url = `${BASE_API}/projects`
    const token = Cookie.get('token')

    return (dispatch: any) => {

        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'POST',
                data: {
                    title,
                    pool,
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
                    dispatch(setTeamsData([data.pool, ...data.teams]))
                    dispatch(clearErrors())
                    dispatch(setCreateProjectModal(false))
                })
                .catch(error => {
                    apiErrorHandling(error, dispatch)
                })
                .finally(() => dispatch(setLoading(false)))
        } else {
            alert('not authorized')
            // dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function fetchProject(id: number) {

    const url = `${BASE_API}/projects/${id}`
    const token = Cookie.get('token')

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
                    dispatch(setTeamsData([data.pool, ...data.teams]))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            alert('not authorized')
            // dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    };
}

export function updateProject(id: number, payload: { pool?: ITeam, teams?: ITeam[] }) {
    const url = `${BASE_API}/projects/${id}`
    const token = Cookie.get('token')

    return (dispatch: any) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'PUT',
                data: {...payload},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => res.data)
                .then(data => {
                    if (payload.pool && !payload.teams) {
                        dispatch({type: SET_POOL, pool: data.pool})
                    } else {
                        dispatch(setTeamsData([data.pool, ...data.teams]))
                    }
                    dispatch(clearErrors())
                    dispatch(setAddMemberModal(false))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function deleteProject(id: number) {
    const url = `${BASE_API}/projects/${id}`
    const token = Cookie.get('token')

    return (dispatch: any) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(() => {
                    dispatch(fetchProjectsList(token))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function fetchProjectsList(token: string) {

    const url = `${BASE_API}/projects`

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
                    dispatch({type: SET_PROJECTS, projects})
                    dispatch({type: SET_ACTIVE_PROJECT, activeProject})
                    dispatch(setTeamsData([data[0].pool, ...data[0].teams]))
                    dispatch(clearErrors())
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
        }
    };
}

/*===== UTILS =====*/

export function clearErrors() {
    return (dispatch: any) => {
        dispatch({type: SET_ERROR, errorApiMessage: ''})
        dispatch({type: PROCESS_FAILED, processFailed: false})
    }
}

function apiErrorHandling(error: any, dispatch: any) {

    if (error.response) {
        let msg: string
        try {
            msg = Array.isArray(error.response.data.message) ? error.response.data.message[0].messages[0].message : 'Something wrong'
        } catch {
            msg = 'Something wrong'
        }
        console.log(msg)
        dispatch({
            type: SET_ERROR,
            errorApiMessage: msg
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
    dispatch({type: PROCESS_FAILED, processFailed: true})
    console.log(error)
}