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
    encData: string
}

export interface ITeamProfile {
    label: string,
    items: IEmployeeProfile[]
}

export interface ValueByCat {
    title: string
    value: number
}


export interface ModalProps {
    isModalShown: boolean
    closeModal: () => void
}

export interface LoginBtnProps {
    handleLogin: (name: string, email: string) => void
    closeModal: () => void
    isEnabled: boolean
}

export interface Question {
    title: string,
    values: Array<string>
    labels?: Array<string>
    isRequired: number | boolean
}

export interface QuestionsProps {
    saveAnswers: (data: number[] | number[][]) => void
    questions: Array<Question>
    isVisible: boolean
    changeBlock: (blockToShow: string, currentBlock?: string) => void
    content?: string
}

export type PersonalInfoType = Array<number>
export type TestResultType = Array<number[]>
export type FullResultType = [PersonalInfoType, TestResultType]


