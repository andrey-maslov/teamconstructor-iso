import {
    T_COMPARISON_IN_PROCESS,
    T_SET_COMPARISON_READY,
    SET_TEAMS_DATA,
    SET_ACTIVE_TEAM, SET_RANDOM, FETCH_TEAMS

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
//     {
//         id: `2-${new Date().getTime()}`,
//         name: 'Таня',
//         position: 'QA engineer',
//         encData: 'W1sxLDEsMV0sW1szLC0yLDIsNSwxXSxbLTQsLTIsLTIsMSwtMV0sWy00LDUsLTUsMSwtMV0sWzAsMSwtMSwxLC00XSxbMSwtNCwtMiwxLC0xXV1d',
//         decData: [[1, 1, 1], [[3, -2, 2, 5, 1], [-4, -2, -2, 1, -1], [-4, 5, -5, 1, -1], [0, 1, -1, 1, -4], [1, -4, -2, 1, -1]]]
//     },
//     {
//         id: `3-${new Date().getTime()}`,
//         name: 'Сергей Лавриненко',
//         position: 'Business Analyst',
//         encData: 'W1sxLDEsMF0sW1s0LC01LC02LC0yLDBdLFstMiwtMywtNCwwLDNdLFs2LDQsMiwtMSwyXSxbNCw0LDIsMywtNl0sWy0yLC0xLDIsMywwXV1d',
//         decData: [[1, 1, 0], [[4, -5, -6, -2, 0], [-2, -3, -4, 0, 3], [6, 4, 2, -1, 2], [4, 4, 2, 3, -6], [-2, -1, 2, 3, 0]]]
//     },
//     {
//         id: `4-${new Date().getTime()}`,
//         name: 'Andrey Maslov',
//         position: 'Web Developer',
//         encData: 'W1sxLDEsMV0sW1stMiwtMywtMSwyLC0xXSxbLTIsLTIsLTIsLTQsLTFdLFstMiwtMSwtMiwxLC02XSxbLTEsMSwxLC0yLC0zXSxbMSwtMywyLDEsLTJdXV0=',
//         decData: [[1, 1, 1], [[-2, -3, -1, 2, -1], [-2, -2, -2, -4, -1], [-2, -1, -2, 1, -6], [-1, 1, 1, -2, -3], [1, -3, 2, 1, -2]]]
//     },
//     {
//         id: `5-${new Date().getTime()}`,
//         name: 'Julia Sobal',
//         position: 'QA junior',
//         encData: 'W1sxLDEsMV0sW1stNCwxLDEsLTMsLTFdLFswLC0yLDAsLTUsLTJdLFstNCwwLC0zLC0yLC0yXSxbLTEsMCwxLC0xLC00XSxbMSwtNCw0LDEsLTRdXV0=',
//         decData: [[1, 1, 1], [[-4, 1, 1, -3, -1], [0, -2, 0, -5, -2], [-4, 0, -3, -2, -2], [-1, 0, 1, -1, -4], [1, -4, 4, 1, -4]]]
//     },
//     {
//         id: `6-${new Date().getTime()}`,
//         name: 'Паша',
//         position: 'Tech Writer',
//         encData: 'W1swLDEsMF0sW1stMiw0LDAsLTEsMF0sWy0xLDEsLTMsMSwtMV0sWy00LDAsLTIsMSw0XSxbLTYsLTIsLTIsLTQsMl0sWzAsLTIsLTEsLTEsLTJdXV0=',
//         decData: [[0, 1, 0], [[-2, 4, 0, -1, 0], [-1, 1, -3, 1, -1], [-4, 0, -2, 1, 4], [-6, -2, -2, -4, 2], [0, -2, -1, -1, -2]]]
//     },
//     {
//         id: `7-${new Date().getTime()}`,
//         name: 'Маша',
//         position: 'Backend Developer',
//         encData: 'W1swLDAsMV0sW1stMSwxLDAsLTMsLTNdLFsyLC0yLC0zLC0xLDNdLFstNCwwLDEsLTEsM10sWzEsMCwzLDEsLTRdLFstMSwxLC0xLDMsLTNdXV0=',
//         decData: [[0, 0, 1], [[-1, 1, 0, -3, -3], [2, -2, -3, -1, 3], [-4, 0, 1, -1, 3], [1, 0, 3, 1, -4], [-1, 1, -1, 3, -3]]]
//     },
// ]

// let STATE = loadState('team');
let STATE: any = null;

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
        case FETCH_TEAMS :
            return {
                ...state,
                teams
            }
        default:
            return state;
    }
};