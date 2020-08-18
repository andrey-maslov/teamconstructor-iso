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
    ADD_MEMBER,
    SET_AUTH_MODAL,
    FETCH_CONTENT, SET_TEAMS,
    SET_ERROR,
    CLEAR_ERROR, LOADING, ADD_PROJECT, SET_ACTIVE_PROJECT, SET_PROJECTS, SET_CREATE_PROJECT_MODAL,
} from './actionTypes';
import {IEmployeeProfile, ILoginData, IMember, IRegisterData, ITeamProfile,} from "../../constants/types";
import {CONTENT_API, BASE_API} from "../../constants/constants";
import axios from 'axios'


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

export function clearUserData(): { type: string } {
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
export function setTeamsData(teamsData: ITeamProfile[]): { type: string, teams: ITeamProfile[] } {
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


/*
FETCHING DATA
 */

export const fetchTerms = (lang: string) => {

    // const url = `https://api.salary2.me/psychologies?lang=${lang}`;
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

    // const url = `https://api.salary2.me/psychologies/3`;
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

export const authUser = (userData: IRegisterData | ILoginData, authType: 'register' | 'login') => {

    const url = (authType === 'register') ? `${BASE_API}/auth/local/register` : `${BASE_API}/auth/local`

    return (dispatch: any) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                const data = res.json()
                return data
            })
            .then(data => {
                if (data.statusCode === 400) {
                    setApiErrorMsg(data, dispatch)
                } else {
                    console.log(`SUCCESS ${authType}`, data)
                    const user = data.user;
                    const projects: { id: number, title: string }[] = user.projects.map((item: any) => ({
                        id: item.id, title: item.title
                    }))
                    dispatch({type: SET_ERROR, errorMessage: ''})
                    dispatch(setUser(user.id, user.username, user.email, user.role, projects, data.jwt))
                    // dispatch(fetchBoard(projects[0].id, data.jwt))
                }
            })
    }
}


function setUser(id: number, username: string, email: string, role: number, projects: any, token: string) {
    return {
        type: ADD_AUTH_DATA,
        id,
        username,
        email,
        role,
        token,
        projects,
    }
}


/*===== APPLICATION MODE (app reducer) =====*/

export function setLoading(isLoading: boolean): { type: string, isLoading: boolean } {
    return {
        type: LOADING,
        isLoading
    }
}

/*===== FETCH PROJECTS and MEMBERS =====*/

//TODO fixme
export function fetchProject(projectId: number, token: string) {

    const url = `${BASE_API}/projects/${projectId}`;

    return (dispatch: any) => {
        dispatch(setLoading(true))

        axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(data => {
                console.log('SUCCESS fetching project', data)
                dispatch({type: SET_ACTIVE_PROJECT, activeProject: projectId})
            })
            .catch(error => apiErrorHandling(error, dispatch))
            .finally(() => dispatch(setLoading(false)))
    };
}

//TODO fixme
export function createMember(memberData: IMember, userId: number, projectId: number, token: string) {

    const url = `${BASE_API}/members`

    return (dispatch: any) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                ...memberData,
                user: userId,
                project: projectId
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                const data = res.json()
                return data
            })
            .then(data => {
                console.log('after create member', data)
                if (data.statusCode === 400) {
                    setApiErrorMsg(data, dispatch)
                } else {
                    console.log('SUCCESS', data)
                    const newMember = {
                        id: `00-${new Date().getTime()}`,
                        name: data.name,
                        position: data.position,
                        decData: data.decData,
                        baseID: data.id
                    }
                    dispatch({type: SET_ERROR, errorMessage: ''})
                    dispatch(fetchProject(projectId, token))
                    // dispatch(addMemberToPool(newMember))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export function createProject(userId: number, title: string, token: string) {
    const url = `${BASE_API}/projects`
    return (dispatch: any) => {
        dispatch(setLoading(true))
        axios(url, {
            method: 'POST',
            data: {
                user: userId,
                title: title
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                console.log('SUCCESS create project', res)
                dispatch({type: ADD_PROJECT, project: {id: res.data.id, title: res.data.title}})
                dispatch({type: SET_ACTIVE_PROJECT, activeProject: res.data.id})
                dispatch({type: SET_ERROR, errorMessage: ''})
                dispatch(setCreateProjectModal(false))
            })
            .catch(error => apiErrorHandling(error, dispatch))
            .finally(() => dispatch(setLoading(false)))
    }
}

export function deleteProject(id: number, projects: {id: number, title: string}[] | [], activeProject: number | null, token: string,) {
    const url = `${BASE_API}/projects/${id}`
    return (dispatch: any) => {
        dispatch(setLoading(true))
        axios(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                console.log('SUCCESS delete project', res)
                dispatch({type: SET_ACTIVE_PROJECT, activeProject})
                dispatch({type: SET_PROJECTS, projects})
                dispatch({type: SET_ERROR, errorMessage: ''})
            })
            .catch(error => apiErrorHandling(error, dispatch))
            .finally(() => dispatch(setLoading(false)))
    }
}

export function addMemberToPool(member: IEmployeeProfile) {
    return {
        type: ADD_MEMBER,
        member
    }
}

export function getMembersByOrder(idList: number[], teamId: number, members: any): any {

    //if team or pool is empty
    if (!idList || idList.length === 0) {
        return []
    }

    return idList.map((num, i) => {
        const teamMember = members.items.filter((item: any) => item.baseID == num)
        return {
            id: `${teamId}${i}-${new Date().getTime()}`,
            name: teamMember.name,
            position: teamMember.position,
            decData: teamMember.decData
        }
    })
}

function setApiErrorMsg(data: any, dispatch: any): boolean {

    if (data.statusCode === 400) {
        const msg = data.message[0].messages[0].message
        console.log('ERROR 400', msg)
        dispatch({
            type: SET_ERROR,
            errorMessage: msg
        })
        return false
    }
    return true
}

function apiErrorHandling(error: any, dispatch: any) {

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('DATA', error.response.data)
        console.log('STATUS', error.response.status)
        console.log('HEADERS', error.response.headers)
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('ERROR', error.message)
    }
    console.log(error)
}