import { userStoreType } from '../common/reducers/user'
import { teamStoreType } from '../common/reducers/team'
import { pairStoreType } from '../common/reducers/pair'
import { TermsStoreType } from '../common/reducers/terms'
import { modalsStoreType } from '../common/reducers/modals'
import { appStoreType } from '../common/reducers/app'

export type DecodedDataType = [number[], number[][]]

export interface IMember {
    id: string
    name: string,
    position: string,
    decData: DecodedDataType
    baseID: number
}

export interface IProject {
    id: number
    title: string
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
}

export interface IDescWithRange {
    desc: string
    range: [number, number]
}

export interface ISignUpData {
    username: string
    email: string
    password: string
}
export interface ILoginData {
    identifier: string
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
