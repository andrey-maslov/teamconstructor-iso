import React from "react";

export type DecodedDataType = [number[], number[][]]

export type AnswerType = {
    id: string
    value: string
}

export type OctantType = {
    title: string
    value: number
    index: string
}

export interface IEmployeeProfile {
    id: string,
    name: string,
    position: string,
    encData: string,
    decData: DecodedDataType
}

export interface ITeamProfile {
    label: string,
    items: Array<IEmployeeProfile> | any
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

export type GlobalStateType = any