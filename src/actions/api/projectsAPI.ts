import { logOut, setAddMemberModal, setCreateProjectModal, setLoading, setTeamsData } from "../actionCreator"
import { ADD_PROJECT, SET_ACTIVE_PROJECT, SET_POOL, SET_PROJECTS } from "../actionTypes"
import { getCookieFromBrowser } from "../../helper/cookie"
import { anyType, globalStoreType, IProject, ITeam } from "../../constants/types"
import { apiErrorHandling, clearErrors } from "../errorHandling"
import { projectsApiUrl, getAuthConfig, parseProjectData, stringifyProjectData } from "./utils"
import axios from "axios"

export function fetchProjectList(token: string): anyType {
    return (dispatch: anyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios(`${projectsApiUrl}/list?PageNumber=0&PageSize=100`, getAuthConfig(token))
                .then(res => res.data)
                .then(data => {
                    if (data.items && data.items.length === 0) {
                        return false
                    }
                    const projects = data.items.map(parseProjectData)
                    const activeProject = projects.length !== 0 ? {
                        id: projects[0].id,
                        title: projects[0].title
                    } : null
                    dispatch({ type: SET_PROJECTS, projects })
                    dispatch({ type: SET_ACTIVE_PROJECT, activeProject })
                    return false
                    // dispatch(clearErrors())
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
        }
    }
}

export function createProject(project: Omit<IProject, 'id'>): anyType {
    const token = getCookieFromBrowser('token')

    return (dispatch: anyType) => {

        if (token) {
            dispatch(setLoading(true))
            axios.post(`${projectsApiUrl}/add`, stringifyProjectData(project), getAuthConfig(token))
                .then(res => res.data)
                .then(data => {
                    const parsedProject = parseProjectData(data)
                    if (parsedProject) {
                        dispatch({ type: ADD_PROJECT, project: parsedProject })
                        dispatch({
                            type: SET_ACTIVE_PROJECT,
                            activeProject: { id: parsedProject.id, title: parsedProject.title }
                        })
                    }
                    dispatch(setCreateProjectModal(false))
                    // dispatch(clearErrors())
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

export function updateProject(project: { pool: ITeam, teams?: ITeam[], title?: string }): anyType {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType, getState: () => globalStoreType) => {
        if (token) {
            const { id, title } = getState().team.activeProject
            const { teams } = getState().team
            const stringifiedProject = stringifyProjectData(project)
            dispatch(setLoading(true))
            axios.put(
                `${projectsApiUrl}/update/${id}`,
                { id, title, teams: JSON.stringify(teams.slice(1)), ...stringifiedProject },
                getAuthConfig(token)
            )
                .then(res => res.data)
                .then(data => {
                    const parsedProject = parseProjectData(data)
                    if (parsedProject) {
                        if (project.pool && !project.teams) {
                            dispatch({ type: SET_POOL, pool: parsedProject.pool })
                        } else {
                            console.log('set teams data', parsedProject.teams)
                            dispatch(setTeamsData([parsedProject.pool, ...parsedProject.teams]))
                        }
                    }
                    // dispatch(clearErrors())
                })
                .then(() => dispatch(setAddMemberModal(false)))
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function deleteProject(id: number): anyType {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios.delete(`${projectsApiUrl}/delete/${id}`, getAuthConfig(token))
                .then(() => dispatch(fetchProjectList(token)))
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
            dispatch(setCreateProjectModal(false))
        }
    }
}
