import React, {useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {UserResult, SchemeType} from '../../../../../UserResult';
import Charts from "./charts/Charts";
import Box from "../../layout/box/Box";
import Table from "../../tables/table/Table";
import ComparisonTable from "./comparison-table/ComparisonTable";
import {OctantType} from "../../../../../constants/types";
import {BsTable} from "react-icons/bs";

const complementarityDesc = [
    "спонтанность, импульсивность, некоторую агрессивность, умение добиваться целей",
    "спонтанность, стремление к новизне, общительность, умение организовать команду, стремление к новизне",
    "общительность, гибкость, артистизм, подстройку под внешние обстоятельства и окружающих людей",
    "общительность, гибкость, подстройку под внешние обстоятельства и тех людей, которые считаются современными, «продвинутыми»",
    "чувствительность к требованиям социума, внимательность, логику и последовательность",
    "чувствительность к партнеру, внимательность, умение рассуждать, анализировать",
    "умение работать без контроля, способность к синтетическому восприятию действительности, логику в поступках, планирование",
    "напор и способность постоять за себя и партнера. Стабильность и устойчивость"
]

const efficiencyDesc = [
    'Прогноз тяжелый. Вам необходимо внимательно обходить острые углы',
    'Вероятно, вы сможете выполнить то, ради чего объединились. Но, что будет легко, не обещаем',
    'Поздравляем! Вы удивительно хорошие соратники',
    '100% гармоничное сочетание психологических характеристик',
]
const compatibilityDesc = [
    'Прогноз тяжелый. Вам необходимо внимательно обходить острые углы',
    'Вероятно, вы сможете сохранить ваш союз.Что будет легко, не обещаем',
    'Поздравляем! Вы удивительно друг другу подходите',
    '100% гармоничное сочетание психологических характеристик',
]

const PairCoopOutput: React.FC = () => {

    //Initial data
    const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms)
    const isCompareReady: boolean = useSelector((state: any) => state.pairCoopReducer.isComparisonResultReady)
    const userData1: any = useSelector((state: any) => state.pairCoopReducer.user1.data)
    const userData2: any = useSelector((state: any) => state.pairCoopReducer.user2.data)
    const userName1 = useSelector((state: any) => state.pairCoopReducer.user1.name)
    const userName2 = useSelector((state: any) => state.pairCoopReducer.user2.name)

    const unit = {factor: 100, sign: '%'}

    if (!isCompareReady) {
        return null;
    }

    const userResult1 = useMemo(() => new UserResult(userData1[1], schemeCurrent), [userData1, schemeCurrent])
    const userResult2 = useMemo(() => new UserResult(userData2[1], schemeCurrent), [userData2, schemeCurrent])

    const octants1 = useMemo(() => userResult1.getCalculatedOctants(), [userResult1, schemeCurrent]);
    const octants2 = useMemo(() => userResult2.getCalculatedOctants(), [userResult2, schemeCurrent]);

    //tmp
    const userProfile1 = userResult1.profile
    const userProfile2 = userResult2.profile

    //All calculated values for comparison table
    const intensityRatio: number = getIntensityRatio()
    const understanding: number = getUnderstanding()
    const attraction: number[] = getAttraction()
    const lifeAttitudes: number = getLifeAttitudes()
    const similarityThinking: number = getSimilarityThinking()
    const emotionalCompatibility: number = getEmotionalCompatibility()
    const complementarity: string = getComplementarity()
    const maturity: number[] = getPsychologicalMaturity()

    const valuesForEfficiency: number[] = [intensityRatio, understanding, lifeAttitudes, similarityThinking, emotionalCompatibility];
    const efficiency: number = valuesForEfficiency.reduce((a, b) => a + b) / valuesForEfficiency.length;

    const valuesForCompatibility: number[] = [intensityRatio, understanding, ...maturity, lifeAttitudes, similarityThinking, emotionalCompatibility, ...maturity];
    const compatibility: number = valuesForCompatibility.reduce((a, b) => a + b) / valuesForCompatibility.length;

    const comparisonTableData = getComparisonTableData()

    const keyValues = [
        {
            title: 'Взаимное принятие',
            description: getKeyDesc(compatibility, compatibilityDesc, 100),
            value: compatibility
        },
        {
            title: 'Эффективность совместной деятельности',
            description: getKeyDesc(efficiency, efficiencyDesc, 100),
            value: efficiency
        }
    ]

    const profiles = [
        {name: userName1, data: userProfile1},
        {name: userName2, data: userProfile2},
    ]

    return (
        <div>
            <Box>
                <Charts
                    profiles={profiles}
                    keyValues={keyValues}
                />
            </Box>

            <Box
                addClass='result-box'
                title={'Сводная таблица'}
                icon={<BsTable/>}
            >
                <div className="row center-md">
                    <div className="col-md-11">
                        <ComparisonTable tableData={comparisonTableData}/>
                    </div>
                </div>
            </Box>

            <Box addClass='result-box additional-profile' title={'Привязанность-отдельность'}>
                <div className="row center-md">
                    <div className="col-md-11">
                        <Table
                            tableData={[[userName1, ...userData1[1][3]], [userName2, ...userData2[1][3]]]}
                            tableHeader={['', ...(schemeCurrent.axes[3].subAxes).map(item => item.join(' - '))]}
                        />
                    </div>
                </div>
            </Box>

            <Box addClass='result-box full-profile' title={'Профили пользователей'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{userName1}</strong>
                        <Table
                            tableData={userProfile1}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{userName2}</strong>
                        <Table
                            tableData={userProfile2}
                        />
                    </div>
                </div>
            </Box>

            <Box addClass='result-box additional-profile' title={'Отсортированные психотипы'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{userName1}</strong>
                        <Table
                            tableData={userResult1.sortedOctants.map(item => [item.title, item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{userName2}</strong><br/>
                        <Table
                            tableData={userResult2.sortedOctants.map(item => [item.title, item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                </div>
            </Box>
        </div>
    );

    function getKeyDesc(value: number, descArr: string[], factor?: number): string {

        const ratio = factor ? factor : 1

        if (value < 0) {
            return 'Error, value < zero'
        }
        if (value < .5 * ratio) {
            return descArr[0]
        }
        if (value >= .5 * ratio && value <= .8 * ratio) {
            return descArr[1]
        }
        if (value > .8 * ratio && value <= .95 * ratio) {
            return descArr[2]
        }
        return descArr[3]
    }

    function getComparisonTableData() {

        const commonComplexData: string[][] = [
            ['Принятие особенностей партнера', `${intensityRatio.toFixed()}${unit.sign}`],
            ['Взаимное понимание', `${understanding.toFixed()}${unit.sign}`],
            ['Бессознательное притяжение', `${userName1} - ${attraction[0].toFixed()}${unit.sign},</br>${userName2} - ${attraction[1].toFixed()}${unit.sign}`],
            ['Схожесть жизненных установок', `${lifeAttitudes.toFixed()}${unit.sign}`],
            ['Схожесть мышления', `${similarityThinking.toFixed()}${unit.sign}`],
            ['Эмоциональная совместимость', `${emotionalCompatibility.toFixed()}${unit.sign}`],
            ['Дополняемость', complementarity],
            ['Психологическая взрослость', `${userName1} - ${maturity[0].toFixed()}${unit.sign},</br>${userName2} - ${maturity[1].toFixed()}${unit.sign}`],
            ['Эффективность совместной деятельности', `${efficiency.toFixed(2)}${unit.sign}`],
            ['Взаимное принятие', `${compatibility.toFixed(2)}${unit.sign}`]
        ]

        return commonComplexData
    }

    //Вывод о соотношении интенсивности ведущих тенденций (у каждого профиля по одной)
    function getIntensityRatio() {

        const sortedProfile1 = [...userResult1.profile].sort((a, b) => b[1] - a[1]);
        const sortedProfile2 = [...userResult2.profile].sort((a, b) => b[1] - a[1]);

        const maxVal1 = sortedProfile1[0][1]
        const maxVal2 = sortedProfile2[0][1]

        return (maxVal1 < maxVal2 ? maxVal1 / maxVal2 : maxVal2 / maxVal1) * unit.factor;
    }

    //Взаимное понимание
    function getUnderstanding(): number {
        let result = 1; // init result value
        const fraction = 0.125

        for (let i = 0; i < 8; i++) {
            if ((octants1[i].value === 0 && octants2[i].value !== 0) || (octants1[i].value !== 0 && octants2[i].value === 0)) {
                result -= fraction
            }
        }
        return result * unit.factor
    }

    //Бессознательное притяжение
    function getAttraction(): number[] {

        const leadSegment1: OctantType = userResult1.sortedOctants[0]
        const leadSegment2: OctantType = userResult2.sortedOctants[0]

        const oppositeSegmentForUser1 = octants2[getOppositeSegmentIndex(leadSegment1.index)];
        const oppositeSegmentForUser2 = octants1[getOppositeSegmentIndex(leadSegment2.index)];

        const oppositeVals1 = [oppositeSegmentForUser1.value, leadSegment1.value]
        const oppositeVals2 = [oppositeSegmentForUser2.value, leadSegment2.value]

        const ratio1 = oppositeVals1[0] < oppositeVals1[1] ? oppositeVals1[0] / oppositeVals1[1] : oppositeVals1[1] / oppositeVals1[0]
        const ratio2 = oppositeVals2[0] < oppositeVals2[1] ? oppositeVals2[0] / oppositeVals2[1] : oppositeVals2[1] / oppositeVals2[0]

        return [ratio1 * unit.factor, ratio2 * unit.factor];
    }

    //Находим индекс противоположного сегмента (октанта)
    function getOppositeSegmentIndex(segmentLetterIndex: string): number {
        const allIndexes = userResult1.letterIndexes

        //get place of out lead letter index in letter indexes list
        const commonIndex = allIndexes.indexOf(segmentLetterIndex)
        if (commonIndex < 4) {
            return commonIndex + 4
        }
        return commonIndex - 4
    }

    //Сходство жизненных установок
    function getLifeAttitudes() {

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[...userResult1.letterIndexes.slice(0, 4)], [...userResult1.letterIndexes.slice(4)]];

        const leadSegment1 = userResult1.sortedOctants[0]
        const leadSegment2 = userResult2.sortedOctants[0]

        if (leadSegment1.index === leadSegment2.index) {
            return unit.factor
        }

        if (leadSegment1.index[0] === leadSegment2.index[0]) {
            return 0.5 * unit.factor
        }

        if ((indexes[0].includes(leadSegment1.index) && indexes[0].includes(leadSegment2.index)) || (indexes[1].includes(leadSegment1.index) && indexes[1].includes(leadSegment2.index))) {
            return 0.25 * unit.factor
        }

        return 0
    }

    //Схожесть мышления
    function getSimilarityThinking() {

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[...userResult1.letterIndexes.slice(0, 4)], [...userResult1.letterIndexes.slice(4)]];

        const leadSegment1 = userResult1.sortedOctants[0]
        const leadSegment2 = userResult2.sortedOctants[0]

        //Ведущие сегменты совпадают или в одной четверти; 100%'
        if (leadSegment1.index === leadSegment2.index || leadSegment1.index[0] === leadSegment2.index[0]) {
            return unit.factor
        }

        //Ведущие сегменты в одном полушарии; 50%
        if ((indexes[0].includes(leadSegment1.index) && indexes[0].includes(leadSegment2.index)) || (indexes[1].includes(leadSegment1.index) && indexes[1].includes(leadSegment2.index))) {
            return 0.5 * unit.factor
        }

        return 0
    }

    //Эмоциональная совместимость
    function getEmotionalCompatibility() {
        return getLifeAttitudes()
    }

    //Дополняемость
    function getComplementarity(): string {
        const indexes = userResult1.letterIndexes
        const indexOfSegment1 = indexes.indexOf(userResult1.sortedOctants[0].index)
        const indexOfSegment2 = indexes.indexOf(userResult2.sortedOctants[0].index)

        if (userResult1.sortedOctants[0].index === userResult2.sortedOctants[0].index) {
            return `И ${userName1}, и ${userName2} дают паре ${complementarityDesc[indexOfSegment1]}`
        }

        return `${userName1} привносит в пару ${complementarityDesc[indexOfSegment1]}.</br> ${userName2}  привносит в пару ${complementarityDesc[indexOfSegment2]}`
    }

    //Психологическая взрослость
    function getPsychologicalMaturity() {
        const allOctants = [octants1, octants2]

        //init
        const counter = Array(allOctants.length).fill(0);

        //find counts of positive octants values for each profile
        for (let i = 0; i < allOctants.length; i++) {
            for (let j = 0; j < allOctants[0].length; j++) {
                if (allOctants[i][j].value !== 0) {
                    counter[i]++
                }
            }
        }

        return counter.map(item => item / 8 * unit.factor)
    }


    // function makeLog(data: string[]) {
    //     dispatch(saveLog(data))
    // }
}

export default PairCoopOutput;