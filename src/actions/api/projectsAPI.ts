import { AnyType, IProject, ITeam } from "../../constants/types"
import { BASE_API } from "../../constants/constants"
import Cookie from "js-cookie"
import axios from "axios"
import { ADD_PROJECT, SET_ACTIVE_PROJECT, SET_POOL, SET_PROJECTS } from "../actionTypes"
import { apiErrorHandling, clearErrors } from "../errorHandling"
import { setAddMemberModal, setCreateProjectModal, setLoading, setTeamsData } from "../actionCreator"

export function createProject(title: string, pool: ITeam, teams: ITeam[]): AnyType {
    const url = `${ BASE_API }/projects`
    const token = Cookie.get('token')

    return (dispatch: AnyType) => {

        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'POST',
                data: {
                    title,
                    pool,
                    teams,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ token }`
                },
            })
                .then(res => res.data)
                .then(data => {
                    dispatch({ type: ADD_PROJECT, project: { id: data.id, title: data.title } })
                    dispatch({ type: SET_ACTIVE_PROJECT, activeProject: { id: data.id, title: data.title } })
                    dispatch(setTeamsData([ data.pool, ...data.teams ]))
                    // dispatch(clearErrors())
                    dispatch(setCreateProjectModal(false))
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

export function fetchProject(id: number): AnyType {

    const url = `${ BASE_API }/projects/${ id }`
    const token = Cookie.get('token')

    return (dispatch: AnyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ token }`
                }
            })
                .then(res => res.data)
                .then(data => {
                    dispatch({ type: SET_ACTIVE_PROJECT, activeProject: { id: data.id, title: data.title } })
                    dispatch(setTeamsData([ data.pool, ...data.teams ]))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            alert('not authorized')
            // dispatch(logOut())
            dispatch(setCreateProjectModal(false))
        }
    };
}

export function updateProject(id: number, payload: { pool?: ITeam, teams?: ITeam[] }): AnyType {
    const url = `${ BASE_API }/projects/${ id }`
    const token = Cookie.get('token')

    return (dispatch: AnyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'PUT',
                data: { ...payload },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ token }`
                },
            })
                .then(res => res.data)
                .then(data => {
                    if (payload.pool && !payload.teams) {
                        dispatch({ type: SET_POOL, pool: data.pool })
                    } else {
                        dispatch(setTeamsData([ data.pool, ...data.teams ]))
                    }
                    // dispatch(clearErrors())
                    dispatch(setAddMemberModal(false))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function deleteProject(id: number): AnyType {
    const url = `${ BASE_API }/projects/${ id }`
    const token = Cookie.get('token')

    return (dispatch: AnyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${ token }`
                },
            })
                .then(() => {
                    dispatch(fetchProjectsList(token))
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
            dispatch(setCreateProjectModal(false))
        }
    }
}

export function fetchProjectsList(token: string): AnyType {

    const url = `${ BASE_API }/projects`

    return (dispatch: AnyType) => {
        if (token) {
            dispatch(setLoading(true))
            axios(url, {
                headers: {
                    'Authorization': `Bearer ${ token }`
                }
            })
                .then(res => res.data)
                .then(data => {
                    const projects: IProject[] = data.map((item: AnyType) => ({
                        id: item.id, title: item.title
                    }))
                    const activeProject = projects.length !== 0 ? projects[0] : null
                    dispatch({ type: SET_PROJECTS, projects })
                    dispatch({ type: SET_ACTIVE_PROJECT, activeProject })
                    dispatch(setTeamsData([ data[0].pool, ...data[0].teams ]))
                    // dispatch(clearErrors())
                })
                .catch(error => apiErrorHandling(error, dispatch))
                .finally(() => dispatch(setLoading(false)))
        } else {
            // dispatch(logOut())
            alert('not authorized')
        }
    };
}