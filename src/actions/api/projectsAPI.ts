import { logOut, setAddMemberModal, setCreateProjectModal, setLoading, setTeamsData } from "../actionCreator"
import { ADD_PROJECT, SET_ACTIVE_PROJECT, SET_PROJECTS } from "../actionTypes"
import { getCookieFromBrowser } from "../../helper/cookie"
import { anyType, globalStoreType, IProject, IProjectFromBase, IProjectLocal, ITeam } from "../../constants/types"
import { apiErrorHandling, clearErrors } from "../errorHandling"
import { projectsApiUrl, getAuthConfig, parseProjectData, stringifyProjectData } from "./utils"
import axios from "axios"
import { isBrowser } from "../../helper/helper";

export function fetchProjectList(token: string, projectId?: string): anyType {
    return (dispatch: anyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios.get<{ items: IProjectFromBase[] | anyType }>(
                `${projectsApiUrl}/list?PageNumber=0&PageSize=100`,
                getAuthConfig(token)
            )
                .then(res => res.data)
                .then(data => {
                    if (data.items && data.items.length === 0) {
                        return {}
                    }
                    const projects: IProject[] = data.items.map(parseProjectData) || []
                    const projectsToShow = projects.map(({ id, title }) => ({ id, title }))
                    let activeProject: IProjectLocal

                    if (projectId && projects.length !== 0) {
                        const tempProject = projects.filter(item => item.id === projectId)[0]
                        activeProject = {
                            id: tempProject.id,
                            title: tempProject.title,
                            teams: [tempProject.pool, ...tempProject.teams]
                        }
                    } else {
                        activeProject = {
                            id: projects[0].id,
                            title: projects[0].title,
                            teams: [projects[0].pool, ...projects[0].teams]
                        }
                    }
                    return { activeProject, projectsToShow }
                })
                .then(({projectsToShow, activeProject}) => {
                    if (projectsToShow && activeProject) {
                        dispatch({ type: SET_PROJECTS, projects: projectsToShow })
                        dispatch({ type: SET_ACTIVE_PROJECT, activeProject: activeProject })
                    }
                    return false
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
        }
    }
}

export function createProject(project: Omit<IProject, 'id'>): anyType {
    const token = getCookieFromBrowser('token')

    return (dispatch: anyType) => {

        if (token) {
            dispatch(setLoading(true))
            axios.post<IProjectFromBase>(`${projectsApiUrl}/add`, stringifyProjectData(project), getAuthConfig(token))
                .then(res => res.data)
                .then(data => {
                    const parsedProject: IProject | null = parseProjectData(data)
                    if (parsedProject) {
                        dispatch({ type: ADD_PROJECT, project: { id: parsedProject.id, title: parsedProject.title } })
                        dispatch({
                            type: SET_ACTIVE_PROJECT,
                            activeProject: parsedProject
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
            const { teams } = getState().team.activeProject
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
                    if (parsedProject && Array.isArray(parsedProject.teams)) {
                        dispatch(setTeamsData([parsedProject.pool, ...parsedProject.teams]))
                    } else if (parsedProject) {
                        dispatch(setTeamsData([parsedProject.pool]))
                    }
                    // dispatch(clearErrors())
                })
                .then(() => dispatch(setAddMemberModal(false)))
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function deleteProject(id: string): anyType {
    const token = getCookieFromBrowser('token')
    return (dispatch: anyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios.delete(`${projectsApiUrl}/delete/${id}`, getAuthConfig(token))
                .then(() => {
                    if (isBrowser) {
                        location.reload()
                    }
                    dispatch(fetchProjectList(token))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    }
}
