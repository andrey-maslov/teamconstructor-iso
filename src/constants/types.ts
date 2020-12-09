import { userStoreType } from '../reducers/user'
import { teamStoreType } from '../reducers/team'
import { pairStoreType } from '../reducers/pair'
import { TermsStoreType } from '../reducers/terms'
import { modalsStoreType } from '../reducers/modals'
import { appStoreType } from '../reducers/app'

export type AnyType = any

export type DecodedDataType = [number[], number[][]]

export interface IMember {
    id: string
    name: string,
    position: string,
    decData: DecodedDataType
    baseID: number
}

export interface IProjectShort {
    id: string
    title: string
}

export interface IProject {
    id: string
    title: string
    pool: ITeam
    teams: ITeam[]
}

export interface ITeam {
    id: number,
    title: string,
    items: Array<IMember> | any
}

export interface INavRoute {
    title: string
    path: string
    access: string
    icon: React.ReactNode
}

export interface IModalProps {
    visible: boolean
    closeModal: () => void
    isLarge?: boolean
}

export interface IDescWithRange {
    desc: string
    range: [number, number]
}

export interface ISignUpData {
    email: string
    password: string
    firstName: string
    lastName: string
    city: {
        id: number
        name: string
    }
    service: number
}

export interface ISignInData {
    username: string
    password: string
}

export type TableRow = (string | number)[] | null

export type globalStoreType = {
    user: userStoreType
    team: teamStoreType
    pair: pairStoreType
    terms: TermsStoreType
    modals: modalsStoreType
    app: appStoreType
}

export interface IOneFieldForm<T> {
    [key: string]: T
}

export interface IGetTestsResponse {
    id: number
    userId: string
    value: string
    type: number
}

export interface IUserData {
    firstName: string
    lastName: string
    email: string
    position?: string
    provider?: string
    isPublicProfile?: boolean
    isOpenForWork?: boolean
}

export interface INewPwdData {
    code: string
    newPassword: string
    email: string
}

export interface IPairData {
    type: string,
    data1: [] | string,
    data2: [] | string,
    name1: string,
    name2: string
}
