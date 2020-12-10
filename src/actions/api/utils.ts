import { API_VER, BASE_API } from "../../constants/constants";
import { AnyType, IProject, ITeam } from "../../constants/types";

export const accountApiUrl = `${BASE_API}/api/v${API_VER}/Account`
export const projectsApiUrl = `${BASE_API}/api/v${API_VER}/Projects`
export const usersApiUrl = `${BASE_API}/api/v${API_VER}/Users`
export const testApiUrl = `${BASE_API}/api/v${API_VER}/PsychologicalTests`

export interface IProjectFromBase {
    id: string
    title: string
    pool: string
    teams: string
}

export const getAuthConfig = (jwt: string) => {
    return {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    }
}

export const parseProjectData = (project: IProjectFromBase): IProject => {
    const parsedPool = JSON.parse(project.pool)
    const parsedTeams = JSON.parse(project.teams)
    if (!parsedPool.title || !parsedPool.id || !Array.isArray(parsedPool.items)) {
        return {
            id: 'fail',
            title: 'failed project - pool',
            pool: { id: 999, title: 'failed pool', items: [] },
            teams: parsedTeams
        }
    }
    if (!Array.isArray(parsedTeams)) {
        return {
            id: 'fail',
            title: 'failed project - teams',
            pool: parsedPool,
            teams: []
        }
    }
    return {
        id: project.id,
        title: project.title,
        pool: parsedPool,
        teams: parsedTeams
    }
}

export const stringifyProjectData = (project: { pool: ITeam, teams?: ITeam[], title?: string }): AnyType => {
    const stringifiedPool = project.pool ? JSON.stringify(project.pool) : null
    const stringifiedTeams = project.teams ? JSON.stringify(project.teams) : null

    return {
        ...project.title && { title: project.title },
        ...project.pool && { pool: stringifiedPool },
        ...project.teams && { teams: stringifiedTeams }
    }
}