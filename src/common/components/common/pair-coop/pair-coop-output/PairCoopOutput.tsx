import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {UserResult, SchemeType} from '../../../../../UserResult';
import RadarChart from "../../charts/radar-chart/RadarChart";
import Box from "../../layout/box/Box";
import Table from "../../tables/table/Table";
import ComparisonTable from "./comparison-table/ComparisonTable";
import {DecodedDataType, GlobalStateType, OctantType} from "../../../../../constants/types";
import {BsTable} from "react-icons/bs";
import KeyIndicator from "./key-indicator/KeyIndicator";

export const complementarityDesc = [
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
    const schemeCurrent: SchemeType     = useSelector((state: GlobalStateType) => state.termsReducer.terms)
    const isResultReady: boolean        = useSelector((state: GlobalStateType) => state.pairCoopReducer.isComparisonResultReady)
    const decodedData1: DecodedDataType = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner1.data)
    const decodedData2: DecodedDataType = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner2.data)
    const name1: string                 = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner1.name)
    const name2: string                 = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner2.name)

    const unit = {factor: 100, sign: '%'}

    if (!isResultReady) {
        return null;
    }

    const fullResult1 = new UserResult(decodedData1[1], schemeCurrent)
    const fullResult2 = new UserResult(decodedData2[1], schemeCurrent)

    const octants1 = fullResult1.getCalculatedOctants();
    const octants2 = fullResult2.getCalculatedOctants();

    //tmp
    const profile1 = fullResult1.profile
    const profile2 = fullResult2.profile

    //All calculated values for comparison table
    const intensityRatio: number         = getIntensityRatio()
    const understanding: number          = getUnderstanding()
    const attraction: number[]           = getAttraction()
    const lifeAttitudes: number          = getLifeAttitudes()
    const similarityThinking: number     = getSimilarityThinking()
    const emotionalCompatibility: number = getEmotionalCompatibility()
    const complementarity: string        = getComplementarity()
    const maturity: number[]             = getPsychologicalMaturity()

    const valuesForEfficiency: number[] = [intensityRatio, understanding, lifeAttitudes, similarityThinking, emotionalCompatibility];
    const efficiency: number = valuesForEfficiency.reduce((a, b) => a + b) / valuesForEfficiency.length;

    const valuesForCompatibility: number[] = [intensityRatio, understanding, ...maturity, lifeAttitudes, similarityThinking, emotionalCompatibility, ...maturity];
    const compatibility: number = valuesForCompatibility.reduce((a, b) => a + b) / valuesForCompatibility.length;

    const comparisonTableData = getComparisonTableData()

    const keyValues = [
        {
            title: 'Взаимное принятие',
            description: getKeyDesc(compatibility, compatibilityDesc, unit.factor),
            value: compatibility
        },
        {
            title: 'Эффективность совместной деятельности',
            description: getKeyDesc(efficiency, efficiencyDesc, unit.factor),
            value: efficiency
        }
    ]

    return (
        <>
            <Box title={`Результаты анализа совместимости пары ${name1} и ${name2}`}>
                <div className="row around-md">
                    <RadarChart
                        profiles={[profile1, profile2]}
                        names={[name1, name2]}
                    />
                    <div>
                        {keyValues.map((item, i) => (
                            <KeyIndicator
                                key={i}
                                title={item.title}
                                description={item.description}
                                value={item.value}
                            />
                        ))}
                    </div>
                </div>
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
                            tableData={[[name1, ...decodedData1[1][3]], [name2, ...decodedData2[1][3]]]}
                            tableHeader={['', ...(schemeCurrent.axes[3].subAxes).map(item => item.join(' - '))]}
                        />
                    </div>
                </div>
            </Box>

            <Box addClass='result-box full-profile' title={'Профили пользователей'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={profile1}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong>
                        <Table
                            tableData={profile2}
                        />
                    </div>
                </div>
            </Box>

            <Box addClass='result-box additional-profile' title={'Отсортированные психотипы'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={fullResult1.sortedOctants.map(item => [item.title, item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong><br/>
                        <Table
                            tableData={fullResult2.sortedOctants.map(item => [item.title, item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                </div>
            </Box>
        </>
    );

    //TODO fix to work with different numbers of descs/checkpoints
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

        return [
            ['Принятие особенностей партнера', `${intensityRatio.toFixed()}${unit.sign}`],
            ['Взаимное понимание', `${understanding.toFixed()}${unit.sign}`],
            ['Бессознательное притяжение', `${name1} - ${attraction[0].toFixed()}${unit.sign},</br>${name2} - ${attraction[1].toFixed()}${unit.sign}`],
            ['Схожесть жизненных установок', `${lifeAttitudes.toFixed()}${unit.sign}`],
            ['Схожесть мышления', `${similarityThinking.toFixed()}${unit.sign}`],
            ['Эмоциональная совместимость', `${emotionalCompatibility.toFixed()}${unit.sign}`],
            ['Дополняемость', complementarity],
            ['Психологическая взрослость', `${name1} - ${maturity[0].toFixed()}${unit.sign},</br>${name2} - ${maturity[1].toFixed()}${unit.sign}`],
            ['Эффективность совместной деятельности', `${efficiency.toFixed(2)}${unit.sign}`],
            ['Взаимное принятие', `${compatibility.toFixed(2)}${unit.sign}`]
        ]
    }

    //Вывод о соотношении интенсивности ведущих тенденций (у каждого профиля по одной)
    function getIntensityRatio() {

        const sortedProfile1 = [...fullResult1.profile].sort((a, b) => b[1] - a[1]);
        const sortedProfile2 = [...fullResult2.profile].sort((a, b) => b[1] - a[1]);

        const maxVal1 = sortedProfile1[0][1]
        const maxVal2 = sortedProfile2[0][1]

        if (maxVal1 === 0 || maxVal2 === 0) {
            return 0
        }

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

        const leadSegment1: OctantType = fullResult1.sortedOctants[0]
        const leadSegment2: OctantType = fullResult2.sortedOctants[0]

        const oppositeSegmentForUser1 = octants2[getOppositeSegmentIndex(leadSegment1.index)];
        const oppositeSegmentForUser2 = octants1[getOppositeSegmentIndex(leadSegment2.index)];

        const oppositeVals1 = [oppositeSegmentForUser1.value, leadSegment1.value]
        const oppositeVals2 = [oppositeSegmentForUser2.value, leadSegment2.value]

        if ((oppositeVals1[0] === 0 && oppositeVals1[1] === 0) || oppositeVals2[0] === 0 && oppositeVals2[1] === 0) {
            return [0, 0];
        }

        const ratio1 = oppositeVals1[0] < oppositeVals1[1] ? oppositeVals1[0] / oppositeVals1[1] : oppositeVals1[1] / oppositeVals1[0]
        const ratio2 = oppositeVals2[0] < oppositeVals2[1] ? oppositeVals2[0] / oppositeVals2[1] : oppositeVals2[1] / oppositeVals2[0]

        return [ratio1 * unit.factor, ratio2 * unit.factor];
    }

    //Находим индекс противоположного сегмента (октанта)
    function getOppositeSegmentIndex(segmentLetterIndex: string): number {
        const allIndexes = fullResult1.letterIndexes

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
        const indexes = [[...fullResult1.letterIndexes.slice(0, 4)], [...fullResult1.letterIndexes.slice(4)]];

        const leadSegment1 = fullResult1.sortedOctants[0]
        const leadSegment2 = fullResult2.sortedOctants[0]

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
        const indexes = [[...fullResult1.letterIndexes.slice(0, 4)], [...fullResult1.letterIndexes.slice(4)]];

        const leadSegment1 = fullResult1.sortedOctants[0]
        const leadSegment2 = fullResult2.sortedOctants[0]

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
        const indexes = fullResult1.letterIndexes
        const indexOfSegment1 = indexes.indexOf(fullResult1.sortedOctants[0].index)
        const indexOfSegment2 = indexes.indexOf(fullResult2.sortedOctants[0].index)

        if (fullResult1.sortedOctants[0].index === fullResult2.sortedOctants[0].index) {
            return `И ${name1}, и ${name2} дают паре ${complementarityDesc[indexOfSegment1]}`
        }

        return `${name1} привносит в пару ${complementarityDesc[indexOfSegment1]}.</br> ${name2}  привносит в пару ${complementarityDesc[indexOfSegment2]}`
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
}

export default PairCoopOutput;