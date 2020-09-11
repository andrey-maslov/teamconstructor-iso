export type baseTestResultType = number[][];

export interface IDescWithRange {
    desc: string,
    range: [number, number]
}

export interface IDescWithStatus {
    title: string,
    desc: string,
    status: number
}

export interface IOctant {
    code: string,
    index: number,
    value: number
}

export interface ITendency {
    index: number,
    value: number
}