import {
    T_COMPARISON_IN_PROCESS,
    T_SET_COMPARISON_READY,
    SET_TEAMS_DATA,
    SET_ACTIVE_TEAM, SET_RANDOM, SET_TEAMS, ADD_MEMBER

} from "../actions/actionTypes";
import {loadState} from "../store/sessionStorage";

// const initialStaff = [
//     {
//         id: `0-${new Date().getTime()}`,
//         name: 'Мария',
//         position: 'Manager',
//         encData: 'W1syLDMsMF0sW1stMSwtMSw1LDMsLTFdLFstNCwtMywtMywtMiwtMV0sWzEsMCwtNCwzLC0xXSxbLTIsNiwwLDEsLTRdLFs0LDEsMSwtNCwtM11dXQ==',
//         decData: [[2, 3, 0], [[-1, -1, 5, 3, -1], [-4, -3, -3, -2, -1], [1, 0, -4, 3, -1], [-2, 6, 0, 1, -4], [4, 1, 1, -4, -3]]]
//     },
//     {
//         id: `1-${new Date().getTime()}`,
//         name: 'Павел',
//         position: 'Designer',
//         encData: 'W1sxLDQsMV0sW1sxLDMsMywtMywxXSxbLTQsLTIsLTIsNCwtMl0sWy0xLDEsLTMsMCwtNF0sWy0zLC00LC0yLDUsLTNdLFsxLC0yLC0yLC0yLDFdXV0=',
//         decData: [[1, 4, 1], [[1, 3, 3, -3, 1], [-4, -2, -2, 4, -2], [-1, 1, -3, 0, -4], [-3, -4, -2, 5, -3], [1, -2, -2, -2, 1]]]
//     },
// ]

let STATE = loadState('teams');
// let STATE: any = null;

if (!STATE) {
    STATE = {
        isComparisonResultReady: false,
        isComparisonInProcess: false,
        teams: [],
        activeTeam: 0,
        randomNum: 0,
    }
}

type teamCoopReducerType = typeof STATE;

export const teamCoopReducer = (state = STATE, {
    type,
    isComparisonResultReady,
    isComparisonInProcess,
    teams,
    activeTeam,
    randomNum,
    member,
}: any) => {
    switch (type) {
        case T_SET_COMPARISON_READY :
            return {
                ...state,
                isComparisonResultReady,
            };
        case T_COMPARISON_IN_PROCESS :
            return {
                ...state,
                isComparisonInProcess,
            };
        case SET_TEAMS_DATA :
            return {
                ...state,
                teams
            }
        case SET_ACTIVE_TEAM :
            return {
                ...state,
                activeTeam
            }
        case SET_RANDOM :
            return {
                ...state,
                randomNum
            }
        // case ADD_MEMBER :
        //     return {
        //         ...state,
        //         teams: [
        //             {
        //                 title: 'new',
        //                 items: [member, ...state.teams[0].items]
        //             },
        //             {
        //                 title: '',
        //                 items: []
        //             }
        //         ]
        //     }
        case SET_TEAMS :
            return {
                ...state,
                teams
            }
        default:
            return state;
    }
};