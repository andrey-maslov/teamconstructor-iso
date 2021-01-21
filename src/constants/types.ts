import { userStoreType } from '../reducers/user'
import { teamStoreType } from '../reducers/team'
import { pairStoreType } from '../reducers/pair'
import { TermsStoreType } from '../reducers/terms'
import { modalsStoreType } from '../reducers/modals'
import { appStoreType } from '../reducers/app'
import { authModes } from "./constants";
import { RiTeamLine } from "react-icons/ri";
import React from "react";

export type anyType = any

export type DecodedDataType = [number[], number[][]]

export interface IMember {
    id: string
    name: string,
    position: string,
    decData: DecodedDataType
    baseID: number
}

export interface IMemberForm {
    name: string
    position: string
    encData: string
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
    access: 'all' | 'auth' | 'premium'
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
    firstName?: string
    lastName?: string
    email?: string
    emailConfirmed?: boolean
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

export type AuthData = ISignUpData | ISignInData

export type AuthType = keyof typeof authModes

// TODO need to typing
export interface IResumeUpload {
    [key: string]: anyType
}

export interface IEmailConfirmation {
    code: string
    userId: string
    email?: string
}

export interface IChangeEmail {
    newEmail: string
    service: number
}

export interface IMembershipPlan {
    autoSearchCount: number | null
    description: string | null
    id: number
    monthCount: number
    price: number
    service: number
    title: string
}

export interface ISubscription {
    id: string
    membershipPlan: IMembershipPlan
    startedDate: string | null
    endedDate: string | null
    status: number
    autoPayment: boolean
}