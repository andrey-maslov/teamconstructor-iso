import {UserResult} from './UserResult'
import {baseTestResultType, IOctant, ITendency} from "./types";
import {IMember} from "../constants/types";

export class Team {

    readonly dataList: baseTestResultType[]
    readonly resultList: UserResult[]
    readonly profileList: ITendency[][]
    readonly portraitList: IOctant[][]
    readonly profile: ITendency[]
    readonly portrait: IOctant[]
    readonly membersCount: number
    readonly maxSector: number
    readonly majorOctants: IOctant[]

    constructor(dataList: baseTestResultType[]) {

        this.dataList = dataList
        this.membersCount = this.dataList.length
        this.resultList = this.dataList.map((member) => {
            return new UserResult(member)
        })
        this.profileList = this.resultList.map(result => result.profile)
        this.portraitList = this.resultList.map(result => result.portrait)
        this.profile = this.getTeamProfile()
        this.portrait = this.getTeamPortrait()
        this.maxSector = this.getMaxSectorSquare()
        this.majorOctants = this.portrait.filter((item: IOctant) => item.value >= this.maxSector * .3)
    }

    /**
     * Психологический профиль команды
     */
    getTeamProfile() {
        const arrSum = this.getAvgValues<ITendency[]>(this.profileList)
        return arrSum.map((item: number[], i: number) => {
            const sum = item.reduce((a, b) => a + b)
            return {index: i, value: Number((sum / this.membersCount).toFixed(1))}
        })
    }

    /**
     * get psychological portrait of the team
     */
    getTeamPortrait(): IOctant[] {
        const arrSum = this.getAvgValues<IOctant[]>(this.portraitList)
        return arrSum.map((item, i) => {
            const sum = item.reduce((a, b) => a + b)
            return {code: UserResult.octantCodeList[i], index: i, value: Number((sum / this.membersCount).toFixed(1))}
        })
    }

    /**
     * Вычисления средних значений профиля и портрета команды из профилей и портретов участников
     */
    getAvgValues<T>(list: Array<T>): number[][] {
        const arrSum: number[][] = [[], [], [], [], [], [], [], []]
        const count = list.length

        for (let i = 0; i < count; i++) {
            for (let k = 0; k < 8; k++) {
                arrSum[k].push(list[i][k].value)
            }
        }
        return arrSum
    }

    /**
     * Get average value based on main tendencies of each member
     */
    getTeamMaxIntensity(): number {
        const maxValues = this.profileList.map(profile => {
            const sorted = [...profile].sort((a, b) => b.value - a.value)
            return sorted[0].value
        })
        return maxValues.reduce((a, b) => a + b) / this.membersCount
    }

    /**
     * Get maximum fact (theoretical) value of sector square
     */
    getMaxSectorSquare(): number {
        const sorted = [...this.portrait].sort((a, b) => (b.value - a.value))
        return sorted[0].value
    }

    /**
     * Get cross-functionality value
     */
    getCrossFunc(): number {

        if (this.maxSector === 0) {
            return -1
        }

        const maxCircleSquare = this.maxSector * 8 // 8 -> number of octants in full circle
        const factCircleSquare = this.portrait.map(item => item.value).reduce((a, b) => a + b);

        return factCircleSquare / maxCircleSquare
    }

    /**
     *
     * @param sortedPortraits
     */
    getInteraction(): number {
        const allMaxValues = this.resultList.map(item => item.sortedOctants[0].value)
        const max = Math.max.apply(null, allMaxValues)
        const min = Math.min.apply(null, allMaxValues)
        return min / max
    }

    /**
     * get emotion compatibility
     */
    getEmotionalComp(): number {
        const values = this.portrait.map(octant => octant.value)
        const rightSum = values.slice(0, 4).reduce((a, b) => a + b)
        const leftSum = values.slice(4).reduce((a, b) => a + b)
        if (leftSum === 0) {
            return -1
        }
        if (rightSum === 0) {
            return -1
        }
        return (leftSum <= rightSum) ? leftSum / rightSum : rightSum / leftSum
    }

    /**
     * get team loyalty
     */
    getLoyalty(): number {

        const values = this.profile.map(item => item.value)
        const topSum = [values[0], values[1], values[7]].reduce((a, b) => a + b)
        const bottomSum = values.slice(3, 6).reduce((a, b) => a + b)

        if (bottomSum === 0) {
            return topSum / 0.1
        }
        return topSum / bottomSum
    }

    /**
     * @param typeInd (number from 1 to 8 of octants. Leader role equals Innovator type, for example)
     */
    getLeadingMemberByType(typeInd: number): number {
        const values = this.portraitList.map(octant => octant[typeInd].value)
        const max = Math.max.apply(null, values)

        return values.indexOf(max)
    }

    /**
     *
     */
    getCommitment(): number {
        //list item = value of responsibility of one member from data block "Привязанность-отдельность"
        const respValsList: number[] = this.dataList.map(item => item[3][0])
        return respValsList.reduce((a, b) => a + b)
    }

    /**
     * @return {number} list of number indexes for get especial descriptions from array
     */
    getDescIndexes(): number[] {
        return this.portrait
            .filter(octant => octant.value >= this.maxSector / 2)
            .map(item => item.index)
    }

    /**
     *
     */
    getNeedfulPsychoType(): number[] {
        const minorOctants: IOctant[] = this.portrait.filter((item: IOctant) => item.value < this.maxSector * .3)
        return minorOctants.map(item => item.index)
    }

    /**
     * get full list of potential candidates without psychological filters
     * @param poolMembers
     * @param teamMembers
     */
    static getAllCandidates(poolMembers: IMember[], teamMembers: IMember[]): IMember[] {
        const teamIdList = teamMembers.map(item => item.baseID)
        return poolMembers.filter(item => !teamIdList.includes(item.baseID))
    }


    /**
     *
     * @param teamSpecInd
     * @param allCandidates
     */
    getCandidates(teamSpecInd: number, allCandidates: IMember[]): IMember[] | null {
        const specsList = [['A1', 'A2', 'B1', 'B2', 'a1', 'a2', 'b1', 'b2'], ['A1', 'A2'], ['B1', 'B2'], ['a1', 'a2'], ['b1', 'b2']]
        const majorCodes   = this.majorOctants.map(item => item.code)

        if (!this.isSmbNeeded(teamSpecInd, specsList)) {
            return null
        }
        if (this.majorOctants.length === 8) {
            return null
        }

        return allCandidates.filter(item => {

            const profile  = UserResult.getProfile(item.decData[1])
            const portrait = UserResult.getPortrait(profile)
            const sortedOctants = [...portrait].sort((a, b) => (b.value - a.value))

            if (!this.checkIntensity(profile)) {
                return false
            }
            return (
                (majorCodes.includes(sortedOctants[0].code) && specsList[teamSpecInd].includes(sortedOctants[1].code))
                ||
                (majorCodes.includes(sortedOctants[1].code) && specsList[teamSpecInd].includes(sortedOctants[0].code))
            )
        })
    }

    /**
     * Проверяет, не слишком ли расходится интенсивность кандидата и команды
     * @param memberProfile
     */
    checkIntensity(memberProfile: ITendency[]): boolean {
        const teamMaxIntensity  = this.getTeamMaxIntensity()
        const sortedMemberProfile = [...memberProfile].sort((a, b) => b.value - a.value)
        return !(sortedMemberProfile[0].value > teamMaxIntensity * 1.3 || sortedMemberProfile[0].value < teamMaxIntensity * .7);
    }

    /**
     * for getCandidate
     * @param specInd
     * @param specsList
     */
    isSmbNeeded(specInd: number, specsList: string[][]): boolean{
        const majorOctantsCodes = this.majorOctants.map(item => item.code)

        if (majorOctantsCodes.includes(specsList[specInd][0]) && majorOctantsCodes.includes(specsList[specInd][1])) {
            const specOctants = this.majorOctants.filter(octant => octant.code === specsList[specInd][0] || octant.code === specsList[specInd][1])
            const maxOctant = specOctants[0].value > specOctants[1].value ? specOctants[0] : specOctants[1]

            if (Math.abs(specOctants[0].value - specOctants[1].value) < maxOctant.value * .3) {
                return false
            }
        }
        return true
    }

    /**
     * Get unwanted members in the team ("white crow")
     * @param members
     */
    getUnwanted(members: IMember[]): IMember[] {
        return members.filter(item => !this.checkIntensity(UserResult.getProfile(item.decData[1])))
    }

}