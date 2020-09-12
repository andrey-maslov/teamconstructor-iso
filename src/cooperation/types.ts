export type baseTestResultType = readonly number[][];

export interface IDescWithRange {
    readonly desc: string,
    readonly range: readonly [number, number]
}

export interface IDescWithStatus {
    readonly title: string,
    readonly desc: string,
    readonly status: number
}

export interface IOctant {
    readonly code: string,
    readonly index: number,
    readonly value: number
}

export interface ITendency {
    readonly index: number,
    readonly value: number
}

export type DecodedDataType = [readonly number[], readonly number[][]]

export interface IMember {
    readonly id: string
    readonly name: string,
    readonly position: string,
    readonly decData: DecodedDataType
    readonly baseID: number
}

export interface IUserResult {
    sortedOctants: IOctant[],
    profile: ITendency[],
    portrait: IOctant[],
    mainOctant: IOctant,
    mainPsychoTypeList: number[],
    mainTendencyList: number[],
}