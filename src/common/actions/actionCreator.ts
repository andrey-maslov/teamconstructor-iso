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
    FETCH_CONTENT, FETCH_TEAMS,
    SET_ERROR,
    CLEAR_ERROR,
} from './actionTypes';
import {ILoginData, IMember, IRegisterData, ITeamProfile,} from "../../constants/types";
import axios from 'axios'
import {API_URL} from "../../constants/constants";


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

export function clearUserData (): {type: string} {
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
        }, 3000)
    }
}


/*
PAIR COMPARISON PROCESS
 */

export function setPairData (data1: [] | string, data2: [] | string, name1: string, name2: string): {
    type: string, data1: [] | string, data2: [] | string, name1: string, name2: string } {
    return {
        type: SET_PAIR_DATA,
        data1,
        data2,
        name1,
        name2
    };
}

export function clearPairData(): {type: string} {
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
export function setTeamsData(teamsData: ITeamProfile[]): {type: string, teams: ITeamProfile[]} {
    return {
        type: SET_TEAMS_DATA,
        teams: teamsData
    };
}

export function setActiveTeam(teamIndex: number): {type: string, activeTeam: number} {
    return {
        type: SET_ACTIVE_TEAM,
        activeTeam: teamIndex
    }
}

export function setRandomNum(randomNum: number): {type: string, randomNum: number} {
    return {
        type: SET_RANDOM,
        randomNum
    }
}

/*
MODALS and ALERTS
 */
export function setAddMemberModal(isAddMemberModal: boolean): {type: string, isAddMemberModal: boolean} {
    return {
        type: SET_ADD_MEMBER_MODAL,
        isAddMemberModal
    }
}
export function setAuthModal(isAuthModal: boolean): {type: string, isAuthModal: boolean} {
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
    const url = `${API_URL}/psychologies/1`;

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
    const url = `${API_URL}/psychologies/3`;

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


//TODO fixe me
// export const fetchPool = (userID: number, token: string) => {
//
//     const url = `${API_URL}/pools?user.id=${userID}`;
//
//     return (dispatch: any) => {
//         fetch(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//             .then(response => response.json())
//             .then(data => {
//                 // dispatch({
//                 //     type: FETCH_TEAMS,
//                 //     teams: data
//                 // });
//             });
//     };
// }




/*===== AUTH =====*/

export const authUser = (userData: IRegisterData | ILoginData, authType: 'register' | 'login') => {

    const url = (authType === 'register') ? `${API_URL}/auth/local/register` : `${API_URL}/auth/local`

    return async (dispatch: any) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
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
                const user = data.user;
                dispatch(clearApiError())
                dispatch(setUser(user.id, user.username, user.email, user.role, user.boards, data.jwt))
            }
        } catch (error) {
            console.error('ERROR', error)
        }
    }
}

export const clearApiError = (): {type: string} => {
    return {
        type: CLEAR_ERROR,
    }
}

function setUser(id: number, username: string, email: string, role: number, boards: any, token: string) {
    return {
        type: ADD_AUTH_DATA,
        id,
        username,
        email,
        role,
        boards,
        token,
    }
}

//TODO fixme
function createBoard(title: string, userId: number, token: string) {

    const url = `${API_URL}/boards`
    const boardData = {
        "title": "staff",
        "user": userId
    }

    return async (dispatch: any) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(boardData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const data = await response.json();
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
            }
        } catch (error) {
            console.error('ERROR', error)
        }
    }
}

//TODO fixme
export function createMember(memberData: IMember, userId: number, boardId: number, token: string) {

    const url = `${API_URL}/members`

    return (dispatch: any) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                ...memberData,
                user: userId,
                board: boardId
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
                console.log(data)
            })
            .catch(err => {
                console.error(err)
            })
    }

    // return async (dispatch: any) => {
    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             body: JSON.stringify(memberData),
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //         })
    //         const data = await response.json();
    //         if (data.statusCode === 400) {
    //             const msg = data.message[0].messages[0].message
    //             console.log('ERROR 400', msg)
    //             dispatch({
    //                 type: SET_ERROR,
    //                 errorMessage: msg
    //             })
    //             return
    //         } else {
    //             console.log('SUCCESS', data)
    //             dispatch(clearApiError())
    //         }
    //     } catch (error) {
    //         console.error('ERROR', error)
    //     }
    // }
}