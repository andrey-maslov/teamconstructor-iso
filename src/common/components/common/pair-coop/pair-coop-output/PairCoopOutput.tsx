import React from 'react';
import {useSelector} from 'react-redux';
import {UserResult, IDescWithRange, IOctant, ITendency, IUserResult} from '../../../../../UserResult';
import RadarChart from "../../charts/radar-chart/RadarChart";
import Box from "../../layout/box/Box";
import Table from "../../tables/table/Table";
import ComparisonTable from "./comparison-table/ComparisonTable";
import {DecodedDataType, GlobalStateType} from "../../../../../constants/types";
import {BsTable} from "react-icons/bs";
import KeyIndicator from "./key-indicator/KeyIndicator";
import {getDescByRange, toPercent} from "../../../../../helper/helper";

const PairCoopOutput: React.FC = () => {

    //Initial data
    const scheme                        = useSelector((state: GlobalStateType) => state.termsReducer.terms)
    const descriptions                  = useSelector((state: GlobalStateType) => state.termsReducer.descriptions)
    const isResultReady: boolean        = useSelector((state: GlobalStateType) => state.pairCoopReducer.isComparisonResultReady)
    const decodedData1: DecodedDataType = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner1.data)
    const decodedData2: DecodedDataType = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner2.data)
    const name1: string                 = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner1.name)
    const name2: string                 = useSelector((state: GlobalStateType) => state.pairCoopReducer.partner2.name)

    if (!isResultReady) {
        return null;
    }

    const fullResult1: IUserResult = new UserResult(decodedData1[1])
    const fullResult2: IUserResult = new UserResult(decodedData2[1])

    const portrait1 = fullResult1.portrait;
    const portrait2 = fullResult2.portrait;

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
    const maturity: number[]             = getPsyMaturity()

    const valuesForEfficiency: number[]  = [intensityRatio, understanding, lifeAttitudes, similarityThinking, emotionalCompatibility];
    const efficiency: number             = valuesForEfficiency.reduce((a, b) => a + b) / valuesForEfficiency.length;

    const valuesForCompatibility: number[] = [intensityRatio, understanding, ...maturity, lifeAttitudes, similarityThinking, emotionalCompatibility, ...maturity];
    const compatibility: number            = valuesForCompatibility.reduce((a, b) => a + b) / valuesForCompatibility.length;

    const {compatibilityDesc, efficiencyDesc, complementarityDesc} = descriptions

    const keyValues = [
        {
            title: 'Взаимное принятие',
            description: getDescByRange(compatibility, compatibilityDesc),
            value: compatibility
        },
        {
            title: 'Эффективность совместной деятельности',
            description: getDescByRange(efficiency, efficiencyDesc),
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
                        labels={scheme.tendencies}
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
                        <ComparisonTable tableData={getComparisonTableData()}/>
                    </div>
                </div>
            </Box>

            <Box addClass='result-box additional-profile' title={'Привязанность-отдельность'}>
                <div className="row center-md">
                    <div className="col-md-11">
                        <Table
                            tableData={[[name1, ...decodedData1[1][3]], [name2, ...decodedData2[1][3]]]}
                            tableHeader={['', ...(scheme.subAxes[3])]}
                        />
                    </div>
                </div>
            </Box>

            <Box addClass='result-box full-profile' title={'Профили пользователей'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={profile1.map((item, i) => [scheme.tendencies[i], item.value])}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong>
                        <Table
                            tableData={profile2.map((item, i) => [scheme.tendencies[i], item.value])}
                        />
                    </div>
                </div>
            </Box>

            <Box addClass='result-box additional-profile' title={'Отсортированные психотипы'}>
                <div className="row around-md">
                    <div className="col-md-6 col-lg-5">
                        <strong>{name1}</strong>
                        <Table
                            tableData={fullResult1.sortedOctants.map((item, i) => [scheme.psychoTypes[i], item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                    <div className="col-md-6 col-lg-5">
                        <strong>{name2}</strong><br/>
                        <Table
                            tableData={fullResult2.sortedOctants.map((item, i) => [scheme.psychoTypes[i], item.value])}
                            tableHeader={['октант', 'значение']}
                        />
                    </div>
                </div>
            </Box>
        </>
    );

    function getComparisonTableData() {

        return [
            ['Принятие особенностей партнера', toPercent(intensityRatio).str],
            ['Взаимное понимание', toPercent(understanding).str],
            ['Бессознательное притяжение', `${name1} - ${toPercent(attraction[0]).str},</br>${name2} - ${toPercent(attraction[1]).str}`],
            ['Схожесть жизненных установок', toPercent(lifeAttitudes).str],
            ['Схожесть мышления', toPercent(similarityThinking).str],
            ['Эмоциональная совместимость', toPercent(emotionalCompatibility).str],
            ['Дополняемость', complementarity],
            ['Психологическая взрослость', `${name1} - ${toPercent(maturity[0]).str},</br>${name2} - ${toPercent(maturity[1]).str}`],
            ['Эффективность совместной деятельности', toPercent(efficiency).str],
            ['Взаимное принятие', toPercent(compatibility).str]
        ]
    }

    //Вывод о соотношении интенсивности ведущих тенденций (у каждого профиля по одной)
    function getIntensityRatio() {

        const maxVal1 = profile1[fullResult1.mainTendencyList[0]].value
        const maxVal2 = profile2[fullResult2.mainTendencyList[0]].value

        if (maxVal1 === 0 || maxVal2 === 0) {
            return 0
        }

        return (maxVal1 < maxVal2 ? maxVal1 / maxVal2 : maxVal2 / maxVal1);
    }

    //Взаимное понимание
    function getUnderstanding(): number {
        let result = 1; // init result value
        const fraction = 0.125

        for (let i = 0; i < 8; i++) {
            if ((portrait1[i].value === 0 && portrait2[i].value !== 0) || (portrait1[i].value !== 0 && portrait2[i].value === 0)) {
                result -= fraction
            }
        }
        return result
    }

    //Бессознательное притяжение
    function getAttraction(): number[] {

        const leadSegment1 = fullResult1.mainOctant
        const leadSegment2 = fullResult2.mainOctant

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

    //Находим индекс противоположного сегмента (октанта)
    function getOppositeSegmentIndex(code: string): number {
        const allIndexes = fullResult1.octantCodeList

        //get place of out lead letter index in letter indexes list
        const commonIndex = allIndexes.indexOf(code)
        if (commonIndex < 4) {
            return commonIndex + 4
        }
        return commonIndex - 4
    }

    //Сходство жизненных установок
    function getLifeAttitudes() {

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[...fullResult1.octantCodeList.slice(0, 4)], [...fullResult1.octantCodeList.slice(4)]];

        const leadSegment1 = fullResult1.mainOctant
        const leadSegment2 = fullResult2.mainOctant

        if (leadSegment1.code === leadSegment2.code) {
            return 1
        }

        if (leadSegment1.code[0] === leadSegment2.code[0]) {
            return 0.5
        }

        if ((indexes[0].includes(leadSegment1.code) && indexes[0].includes(leadSegment2.code)) || (indexes[1].includes(leadSegment1.code) && indexes[1].includes(leadSegment2.code))) {
            return 0.25
        }

        return 0
    }

    //Схожесть мышления
    function getSimilarityThinking() {

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[...fullResult1.octantCodeList.slice(0, 4)], [...fullResult1.octantCodeList.slice(4)]];

        const leadSegment1 = fullResult1.mainOctant
        const leadSegment2 = fullResult2.mainOctant

        //Ведущие сегменты совпадают или в одной четверти; 100%'
        if (leadSegment1.code === leadSegment2.code || leadSegment1.code[0] === leadSegment2.code[0]) {
            return 1
        }

        //Ведущие сегменты в одном полушарии; 50%
        if ((indexes[0].includes(leadSegment1.code) && indexes[0].includes(leadSegment2.code)) || (indexes[1].includes(leadSegment1.code) && indexes[1].includes(leadSegment2.code))) {
            return 0.5
        }

        return 0
    }

    //Эмоциональная совместимость
    function getEmotionalCompatibility() {
        return getLifeAttitudes()
    }

    //Дополняемость
    function getComplementarity(): string {

        const indexOfSegment1 = fullResult1.mainOctant.index
        const indexOfSegment2 = fullResult2.mainOctant.index

        if (fullResult1.mainOctant.code === fullResult2.mainOctant.code) {
            return `И ${name1}, и ${name2} дают паре ${complementarityDesc[indexOfSegment1]}`
        }

        return `${name1} привносит в пару ${complementarityDesc[indexOfSegment1]}.</br> ${name2}  привносит в пару ${complementarityDesc[indexOfSegment2]}`
    }

    //Психологическая взрослость
    function getPsyMaturity() {

        const allOctants = [portrait1, portrait2]

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

        return counter.map(item => item / 8)
    }
}

export default PairCoopOutput;