import {UserResult} from './UserResult'
import {baseTestResultType, IOctant, ITendency} from "./types";

export class Pair {

    readonly partner1: UserResult
    readonly partner2: UserResult
    readonly profile1: ITendency[]
    readonly profile2: ITendency[]
    readonly portrait1: IOctant[]
    readonly portrait2: IOctant[]
    readonly leadSegment1: IOctant
    readonly leadSegment2: IOctant

    constructor(dataList: baseTestResultType[]) {
        this.partner1 = new UserResult(dataList[0])
        this.partner2 = new UserResult(dataList[1])
        this.profile1 = this.partner1.profile
        this.profile2 = this.partner2.profile
        this.portrait1 = this.partner1.portrait
        this.portrait2 = this.partner2.portrait
        this.leadSegment1 = this.partner1.mainOctant
        this.leadSegment2 = this.partner2.mainOctant
    }

    /**
     * Принятие особенностей партнера
     */
    getPartnerAcceptance(): number {

        const maxVal1 = this.profile1[this.partner1.mainTendencyList[0]].value
        const maxVal2 = this.profile2[this.partner2.mainTendencyList[0]].value

        if (maxVal1 === 0 || maxVal2 === 0) {
            return 0
        }

        return (maxVal1 < maxVal2 ? maxVal1 / maxVal2 : maxVal2 / maxVal1);
    }

    /**
     * Взаимное понимание
     */
    getUnderstanding(): number {
        let result = 1; // init result value
        const fraction = 0.125

        for (let i = 0; i < 8; i++) {
            if ((this.portrait1[i].value === 0 && this.portrait2[i].value !== 0)
                ||
                (this.portrait1[i].value !== 0 && this.portrait2[i].value === 0)) {
                result -= fraction
            }
        }
        return result
    }

    /**
     * Бессознательное притяжение
     */
    getAttraction(): number[] {

        const oppositeSegmentForUser1 = this.portrait2[this.getOppositeSegmentIndex(this.leadSegment1.code)];
        const oppositeSegmentForUser2 = this.portrait1[this.getOppositeSegmentIndex(this.leadSegment2.code)];

        const oppositeVals1 = [oppositeSegmentForUser1.value, this.leadSegment1.value]
        const oppositeVals2 = [oppositeSegmentForUser2.value, this.leadSegment2.value]

        if ((oppositeVals1[0] === 0 && oppositeVals1[1] === 0) || oppositeVals2[0] === 0 && oppositeVals2[1] === 0) {
            return [0, 0];
        }

        const ratio1 = oppositeVals1[0] < oppositeVals1[1] ? oppositeVals1[0] / oppositeVals1[1] : oppositeVals1[1] / oppositeVals1[0]
        const ratio2 = oppositeVals2[0] < oppositeVals2[1] ? oppositeVals2[0] / oppositeVals2[1] : oppositeVals2[1] / oppositeVals2[0]

        return [ratio1, ratio2];
    }

    /**
     * Находим индекс противоположного сегмента (октанта)
     * @param code
     */
    getOppositeSegmentIndex(code: string): number {
        const allIndexes = UserResult.octantCodeList

        //get place of out lead letter index in letter indexes list
        const commonIndex = allIndexes.indexOf(code)
        if (commonIndex < 4) {
            return commonIndex + 4
        }
        return commonIndex - 4
    }

    /**
     * Сходство жизненных установок
     */
    getLifeAttitudes(): number {
        const code1 = this.leadSegment1.code
        const code2 = this.leadSegment2.code

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[...UserResult.octantCodeList.slice(0, 4)], [...UserResult.octantCodeList.slice(4)]];

        if (code1 === code2) {
            return 1
        }

        if (code1[0] === code2[0]) {
            return 0.5
        }

        if ((indexes[0].includes(code1) && indexes[0].includes(code2)) || (indexes[1].includes(code1) && indexes[1].includes(code2))) {
            return 0.25
        }

        return 0
    }

    /**
     * Схожесть мышления
     */
    getSimilarityThinking(): number {
        const code1 = this.leadSegment1.code
        const code2 = this.leadSegment2.code

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[...UserResult.octantCodeList.slice(0, 4)], [...UserResult.octantCodeList.slice(4)]];

        //Ведущие сегменты совпадают или в одной четверти; 100%'
        if (code1 === code2 || code1[0] === code2[0]) {
            return 1
        }

        //Ведущие сегменты в одном полушарии; 50%
        if ((indexes[0].includes(code1) && indexes[0].includes(code2)) || (indexes[1].includes(code1) && indexes[1].includes(code2))) {
            return 0.5
        }

        return 0
    }

    /**
     * Психологическая взрослость
     */
    getPsyMaturity(): number[] {
        const value1 = this.portrait1.filter((octant: any) => octant.value !== 0)
        const value2 = this.portrait2.filter((octant: any) => octant.value !== 0)
        return [value1.length / 8, value2.length / 8]
    }

    /**
     * Дополняемость
     */
    getComplementarity(): number[] {

        const indexOfSegment1 = this.leadSegment1.index
        const indexOfSegment2 = this.leadSegment2.index

        if (this.partner1.mainOctant.code === this.partner2.mainOctant.code) {
            return [indexOfSegment1]
        }

        return [indexOfSegment1, indexOfSegment2]
    }

}