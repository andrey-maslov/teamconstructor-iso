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
} from './actionTypes';
import {ITeamProfile} from "../../constants/types";


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


/*
FETCHING DATA
 */

export const fetchTerms = (lang: string) => {
    // const url = `/psychology_${lang}.json`;
    const url = `https://strapi.nobugs.today/psychologies?slug=${lang}`;
// console.log(lang)
    return (dispatch: any) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                dispatch({
                    type: FETCH_TERMS,
                    terms: data[0].terms
                });
            });
    };
};

