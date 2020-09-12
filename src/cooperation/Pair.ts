import {octantCodeList, UserResult} from './UserResult'
import {baseTestResultType, IOctant, ITendency, IUserResult} from "./types";

export function Pair([data1, data2]: baseTestResultType[]) {

    const partner1: IUserResult = UserResult(data1)
    const partner2: IUserResult = UserResult(data2)
    const profile1: ITendency[] = partner1.profile
    const profile2: ITendency[] = partner2.profile
    const portrait1: IOctant[] = partner1.portrait
    const portrait2: IOctant[] = partner2.portrait
    const leadSegment1: IOctant = partner1.mainOctant
    const leadSegment2: IOctant = partner2.mainOctant

    /**
     * Принятие особенностей партнера
     */
    function getPartnerAcceptance(): number {

        const maxVal1 = profile1[partner1.mainTendencyList[0]].value
        const maxVal2 = profile2[partner2.mainTendencyList[0]].value

        if (maxVal1 === 0 || maxVal2 === 0) {
            return 0
        }

        return (maxVal1 < maxVal2 ? maxVal1 / maxVal2 : maxVal2 / maxVal1);
    }

    /**
     * Взаимное понимание
     */
    function getUnderstanding(): number {
        let result = 1; // init result value
        const fraction = 0.125

        portrait1.forEach((octant, i) => {
            if ((octant.value === 0 && portrait2[i].value !== 0)
                ||
                (octant.value !== 0 && portrait2[i].value === 0)) {
                result -= fraction
            }
        })
        return result
    }

    /**
     * Бессознательное притяжение
     */
    function getAttraction(): number[] {

        const oppositeSegmentForUser1 = portrait2[getOppositeSegmentIndex(leadSegment1.code)];
        const oppositeSegmentForUser2 = portrait1[getOppositeSegmentIndex(leadSegment2.code)];

        const oppositeVals1 = [oppositeSegmentForUser1.value, leadSegment1.value]
        const oppositeVals2 = [oppositeSegmentForUser2.value, leadSegment2.value]

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
    function getOppositeSegmentIndex(code: string): number {
        const allIndexes = octantCodeList

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
    function getLifeAttitudes(): number {
        const code1 = leadSegment1.code
        const code2 = leadSegment2.code

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[octantCodeList.slice(0, 4)], [octantCodeList.slice(4)]];

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
    function getSimilarityThinking(): number {
        const code1 = leadSegment1.code
        const code2 = leadSegment2.code

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[octantCodeList.slice(0, 4)], [octantCodeList.slice(4)]];

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
    function getPsyMaturity(): number[] {
        const value1 = portrait1.filter((octant: any) => octant.value !== 0)
        const value2 = portrait2.filter((octant: any) => octant.value !== 0)
        return [value1.length / 8, value2.length / 8]
    }

    /**
     * Дополняемость
     */
    function getComplementarity(): number[] {

        const indexOfSegment1 = leadSegment1.index
        const indexOfSegment2 = leadSegment2.index

        if (partner1.mainOctant.code === partner2.mainOctant.code) {
            return [indexOfSegment1]
        }

        return [indexOfSegment1, indexOfSegment2]
    }

    return Object.freeze({
        partner1,
        partner2,
        profile1,
        profile2,
        portrait1,
        portrait2,
        leadSegment1,
        leadSegment2,
        getPartnerAcceptance,
        getUnderstanding,
        getAttraction,
        getLifeAttitudes,
        getSimilarityThinking,
        getPsyMaturity,
        getComplementarity
    })
}