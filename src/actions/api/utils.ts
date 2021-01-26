import { API_VER, BASE_API, CONTENT_API } from "../../constants/constants";
import { anyType, IProject, IProjectFromBase, ITeam } from "../../constants/types";

export const accountApiUrl = `${BASE_API}/api/v${API_VER}/Account`
export const projectsApiUrl = `${BASE_API}/api/v${API_VER}/Projects`
export const usersApiUrl = `${BASE_API}/api/v${API_VER}/Users`
export const termsApiUrl = `${CONTENT_API}/psychologies`
export const testApiUrl = `${BASE_API}/api/v${API_VER}/PsychologicalTests`
export const billingApiUrl = `${BASE_API}/api/v${API_VER}/Subscriptions`
export const tariffsApiUrl = `${BASE_API}/api/v${API_VER}/MembershipPlans`

interface IHeader {
    headers: {
        Authorization: string
    }
}

export const getAuthConfig = (jwt: string): IHeader => {
    return {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    }
}

export const parseProjectData = (project: IProjectFromBase): IProject | null => {
    try {
        const parsedPool = JSON.parse(project.pool)
        const parsedTeams = JSON.parse(project.teams)

        if (!parsedPool.title || typeof parsedPool.id === 'undefined' || !Array.isArray(parsedPool.items)) {
            return null
        }
        if (!Array.isArray(parsedTeams)) {
            return null
        }
        return {
            id: project.id,
            title: project.title,
            pool: parsedPool,
            teams: parsedTeams
        }
    } catch (err) {
        console.error(err)
        return null
    }
}

export const stringifyProjectData = (project: { pool: ITeam, teams?: ITeam[], title?: string }): anyType => {
    const stringifiedPool = project.pool ? JSON.stringify(project.pool) : null
    const stringifiedTeams = project.teams ? JSON.stringify(project.teams) : null

    return {
        ...project.title && { title: project.title },
        ...project.pool && { pool: stringifiedPool },
        ...project.teams && { teams: stringifiedTeams }
    }
}