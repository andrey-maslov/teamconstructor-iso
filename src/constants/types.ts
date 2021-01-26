import { userStoreType } from '../reducers/user'
import { teamStoreType } from '../reducers/team'
import { pairStoreType } from '../reducers/pair'
import { TermsStoreType } from '../reducers/terms'
import { modalsStoreType } from '../reducers/modals'
import { appStoreType } from '../reducers/app'
import { authModes } from "./constants";
import { RiTeamLine } from "react-icons/ri";
import React from "react";

/**
 * all tariffs ids are real tariffs if from data base
 * 0 - free basic tariff
 * 3 - paid Month tariff with all access
 * 4 - paid Year tariff with all access
 * 5 - free Promo tariff with all access
 */
export type TariffId = 0 | 3 | 4 | 5
export type UserRole = 'base' | 'user' | 'premium'

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

export interface IProjectFromBase {
    id: string
    title: string
    pool: string
    teams: string
}

export interface IProjectLocal {
    id: string
    title: string
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
    id: TariffId
    title: string
    description: string | null
    price: number
    service: number
    monthCount: number
    autoSearchCount?: number | null
    features?: string[]
}

export interface ISubscription {
    id: string
    membershipPlan: IMembershipPlan
    startedDate: string | null
    endedDate: string | null
    status: number
    autoPayment: boolean
}

export interface ITariffText {
    title: string,
    period?: string,
    desc: string,
    features: string[],
    link_title: string
}