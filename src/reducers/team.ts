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
    SET_ACTIVE_PROJECT, ADD_PROJECT, SET_PROJECTS
} from "../actions/actionTypes"
import { anyType, IProject, IProjectLocal, IProjectShort, ITeam } from "../constants/types";

// let STATE = loadState('teams');

export type teamStoreType = {
    isComparisonResultReady: boolean,
    isComparisonInProcess: boolean,
    projects: IProjectShort[],
    activeProject: IProjectLocal,
    activeTeam: number,
    teamSpec: number,
    editedMember: number | null,
    randomNum: number
}

const STATE: teamStoreType = {
    isComparisonResultReady: false,
    isComparisonInProcess: false,
    projects: [],
    activeProject: { id: '', title: '', teams: [] },
    activeTeam: 0,
    teamSpec: 0,
    editedMember: null,
    randomNum: 0
}

export const team = (state = STATE, {
    type,
    isComparisonResultReady,
    isComparisonInProcess,
    teams,
    activeTeam,
    teamSpec,
    randomNum,
    editedMember,
    member,
    projects,
    project,
    activeProject,
}: anyType): anyType => {
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
                activeProject: { ...state.activeProject, teams }
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
            const newTeams = [...state.activeProject.teams]
            newTeams[0].items.push(member)
            return {
                ...state,
                activeProject: { ...state.activeProject, newTeams }
            }
        }
        case SET_EDITED_MEMBER :
            return {
                ...state,
                editedMember
            }
        case SET_ACTIVE_PROJECT : {
            return {
                ...state,
                activeProject
            }
        }
        case ADD_PROJECT :
            return {
                ...state,
                projects: [...state.projects, project]
            }
        case SET_PROJECTS :
            return {
                ...state,
                projects
            }
        case CLEAR_USER_DATA :
            return {
                ...state,
                isComparisonResultReady: false,
                isComparisonInProcess: false,
                projects: [],
                activeProject: { id: '', title: '', teams: [] },
                activeTeam: 0,
                teamSpec: 0,
                editedMember: null,
                randomNum: 0
            }
        default:
            return state
    }
}