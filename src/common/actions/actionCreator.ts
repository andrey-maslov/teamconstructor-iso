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
    CLEAR_ERROR,
} from './actionTypes';
import {IEmployeeProfile, ILoginData, IMember, IRegisterData, ITeamProfile,} from "../../constants/types";
import {CONTENT_API, BASE_API} from "../../constants/constants";


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


//TODO fixme
export function fetchBoard(projectId: number, token: string) {

    const url = `${BASE_API}/projects/${projectId}`;

    return (dispatch: any) => {
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('fetch project', data)
                // const teams = getMembersByOrder(data)
                // console.log(teams)
                // dispatch({
                //     type: SET_TEAMS,
                //     teams: teams
                // });
            });
    };
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
                    const msg = data.message[0].messages[0].message
                    console.log('ERROR 400', msg)
                    dispatch({
                        type: SET_ERROR,
                        errorMessage: msg
                    })
                } else {
                    console.log(`SUCCESS ${authType}`, data)
                    const user = data.user;
                    const projects: { id: number, title: string }[] = user.projects.map((item: any) => ({
                        id: item.id, title: item.title
                    }))
                    dispatch(clearApiError())
                    dispatch(setUser(user.id, user.username, user.email, user.role, projects, data.jwt))
                    // dispatch(fetchBoard(projects[0].id, data.jwt))
                }
            })
    }
}


export const clearApiError = (): { type: string } => {
    return {
        type: CLEAR_ERROR,
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

//TODO fixme
function createBoard(title: string, userId: number, token: string) {

    const url = `${BASE_API}/projects`
    const projectData = {
        "title": title,
        "user": userId
    }

    return async (dispatch: any) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(projectData),
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
                    const msg = data.message[0].messages[0].message
                    console.log('ERROR 400', msg)
                    dispatch({
                        type: SET_ERROR,
                        errorMessage: msg
                    })
                    return
                } else {
                    console.log('SUCCESS', data)
                    dispatch(clearApiError())
                    dispatch(fetchBoard(data.id, token))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
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
                    const msg = data.message[0].messages[0].message
                    console.log('ERROR 400', msg)
                    dispatch({
                        type: SET_ERROR,
                        errorMessage: msg
                    })
                } else {
                    console.log('SUCCESS', data)
                    const newMember = {
                        id: `00-${new Date().getTime()}`,
                        name: data.name,
                        position: data.position,
                        decData: data.decData,
                        baseID: data.id
                    }
                    dispatch(clearApiError())
                    dispatch(fetchBoard(projectId, token))
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
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                user: userId,
                title
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
                console.log('after create project', data)
                if (data.statusCode === 400) {
                    const msg = data.message[0].messages[0].message
                    console.log('ERROR 400', msg)
                    dispatch({
                        type: SET_ERROR,
                        errorMessage: msg
                    })
                } else {
                    console.log('SUCCESS create project', data)
                    dispatch(clearApiError())
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export function addMemberToPool(member: IEmployeeProfile) {
    console.log(member)
    return {
        type: ADD_MEMBER,
        member
    }
}