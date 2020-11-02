import {
    T_COMPARISON_IN_PROCESS,
    T_SET_COMPARISON_READY,
    SET_TEAMS_DATA,
    SET_ACTIVE_TEAM,
    SET_RANDOM,
    ADD_MEMBER,
    SET_EDITED_MEMBER,
    SET_TEAM_SPEC,
    CLEAR_USER_DATA,
    SET_POOL
} from "../actions/actionTypes"

// let STATE = loadState('teams');
let STATE: any = null;

if (!STATE) {
    STATE = {
        isComparisonResultReady: false,
        isComparisonInProcess: false,
        teams: null,
        pool: null,
        activeTeam: 0,
        teamSpec: 0,
        editedMember: null,
        member: null,
        randomNum: 0
    }
}

export type teamStoreType = typeof STATE;

export const team = (state = STATE, {
    type,
    isComparisonResultReady,
    isComparisonInProcess,
    teams,
    pool,
    activeTeam,
    teamSpec,
    randomNum,
    editedMember,
    member,
}: teamStoreType) => {
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
        case SET_POOL : {
            const newTeams = [...state.teams.slice(1)]
            return {
                ...state,
                teams: [pool, ...newTeams]
            }
        }
        case SET_EDITED_MEMBER :
            return {
                ...state,
                editedMember
            }
        case CLEAR_USER_DATA :
            return {
                ...state,
                isComparisonResultReady: false,
                isComparisonInProcess: false,
                teams: null,
                pool: null,
                activeTeam: null,
                teamSpec: 0,
                editedMember: null,
                member: null,
                randomNum: 0
            }
        default:
            return state
    }
}