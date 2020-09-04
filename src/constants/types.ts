import React from "react";

export type DecodedDataType = [number[], number[][]]

export type AnswerType = {
    id: string
    value: string
}

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

export type GlobalStateType = any