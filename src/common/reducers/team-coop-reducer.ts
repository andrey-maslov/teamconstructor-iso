import {
    T_COMPARISON_IN_PROCESS,
    T_SET_COMPARISON_READY,
    SET_TEAMS_DATA,
    SET_ACTIVE_TEAM, SET_RANDOM, SET_TEAMS, ADD_MEMBER, SET_EDITED_MEMBER, SET_TEAM_SPEC

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
// ]

let STATE = loadState('teams');
// let STATE: any = null;

if (!STATE) {
    STATE = {
        isComparisonResultReady: false,
        isComparisonInProcess: false,
        teams: [],
        activeTeam: 0,
        teamSpec: 0,
        editedMember: null,
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
    teamSpec,
    randomNum,
    editedMember,
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
        case SET_TEAM_SPEC :
            return {
                ...state,
                teamSpec
            }
        case SET_RANDOM :
            return {
                ...state,
                randomNum
            }
        case ADD_MEMBER : {
            const newTeams = [...state.teams]
            newTeams[0].items.push(member)
            return {
                ...state,
                teams: newTeams
            }
        }
        case SET_EDITED_MEMBER :
            return {
                ...state,
                editedMember
            }
        case SET_TEAMS :
            return {
                ...state,
                teams
            }
        default:
            return state;
    }
};