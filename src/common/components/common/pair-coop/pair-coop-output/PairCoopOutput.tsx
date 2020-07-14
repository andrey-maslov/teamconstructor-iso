import React, {useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {UserResult, SchemeType} from '../../../../../UserResult';
import {useTranslation} from "react-i18next";
import Charts from "./charts/Charts";
import Box from "../../layout/box/Box";
import Table from "../../tables/table/Table";
import ComparisonTable from "./comparison-table/ComparisonTable";
// import {PersonalInfoType, TestResultType, FullResultType} from '../../../../../constants/types';
import {saveLog} from "../../../../actions/actionCreator";

const complementarity = [
    "приносит в пару: спонтанность, самонадеянность, некоторую агрессивность. Выражает себя через двигательную активность",
    "приносит в пару: спонтанность, стремление к новизне, общительность, стремление быть лидером. Выражает себя через мыслительную активность",
    "приносит в пару: гибкость, артистизм, подстройку под внешние обстоятельства и окружающих людей.Выражает себя через эмоциональную вовлеченность",
    "приносит в пару: гибкость, подстройку под внешние обстоятельства и тех людей, которые считаются современными, «продвинутыми». Выражает себя через социальную вовлеченность",
    "приносит в пару: чувствительность, опаску, повышеннуя тревожность, склонность к раздумьям. Выражает скбя через тревогу и мнительность",
    "приносит в пару: созерцательность. Выражает скбя через чувствительность к окружающим",
    "приносит в пару: замкнутость.Стремиться к максимальному уменьшению контактов и построению систем.",
    "приносит в пару: агрессию, жесткость установок, консерватизм в словах и поступках. Выражает себя через сохраниение того, что есть"
]

const PairCoopOutput: React.FC = () => {

    //Initial data
    const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms)
    const isCompareReady: boolean = useSelector((state: any) => state.pairCoopReducer.isComparisonResultReady)
    const userData1: any = useSelector((state: any) => state.pairCoopReducer.user1.data)
    const userData2: any = useSelector((state: any) => state.pairCoopReducer.user2.data)
    const userName1 = useSelector((state: any) => state.pairCoopReducer.user1.name)
    const userName2 = useSelector((state: any) => state.pairCoopReducer.user2.name)
    const dispatch = useDispatch();

    const unit = {factor: 100, sign: '%'} // 100 - %

    if (!isCompareReady) {
        return null;
    }

    const {t} = useTranslation();

    const userResult1 = useMemo(() => new UserResult(userData1[1], schemeCurrent), [userData1, schemeCurrent])
    const userResult2 = useMemo(() => new UserResult(userData2[1], schemeCurrent), [userData2, schemeCurrent])

    const octants1 = useMemo(() => userResult1.getCalculatedOctants(), [userResult1, schemeCurrent]);
    const octants2 = useMemo(() => userResult2.getCalculatedOctants(), [userResult2, schemeCurrent]);

    //tmp
    const userProfile1 = userResult1.profile
    const userProfile2 = userResult2.profile

    const comparisonTableData = getComparisonTableData()

    const compatibility = 99

    return (
        <div>
            <Box>
                <Charts
                    userProfile1={userProfile1}
                    userProfile2={userProfile2}
                    compatibility={compatibility}
                />
            </Box>

            <Box className='result-box'>
                <h4>Сводная таблица</h4>
                <div className="row center-md">
                    <div className="col-md-11">
                        <ComparisonTable tableData={comparisonTableData}/>
                    </div>
                </div>
            </Box>

            <Box className='result-box additional-profile'>
                <h4>Привязанность-отдельность</h4>
                <div className="row center-md">
                    <div className="col-md-11">
                        <Table
                            tableData={[[userName1, ...userData1[1][3]], [userName2, ...userData2[1][3]]]}
                            tableHeader={['', ...(schemeCurrent.axes[3].subAxes).map(item => item.join(' - '))]}
                        />
                    </div>
                </div>
            </Box>

            <Box className='result-box full-profile'>
                <h4>Профили пользователей</h4>
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

            <Box className='result-box additional-profile'>
                <h4>Отсортированные психотипы</h4>
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

    function getComparisonTableData() {

        //Получаем значение о соотношении главных интенсивностей
        const intensityRatio: number = getIntensityRatio()

        //Получаем взаимное понимание
        const understanding: number = getUnderstanding()

        //
        const lifeAttitudes = getLifeAttitudes();

        // const compatibility = getCompatibility()

        const commonComplexData: string[][] = [
            ['Принятие особенностей партнера', `${intensityRatio}${unit.sign}`],
            ['Взаимное понимание', `${understanding}${unit.sign}`],
            ['Бессознательное притяжение', `fail`],
            ['Схожесть жизненных установок', `${lifeAttitudes}${unit.sign}`],
            ['Вероятность длительного сотрудничества', `${compatibility}${unit.sign}`]
        ]

        return commonComplexData
    }

    //Вывод о соотношении интенсивности ведущих тенденций (у каждого профиля по одной). Разница в процентах
    function getIntensityRatio() {

        const sortedProfile1 = [...userResult1.profile].sort((a, b) => b[1] - a[1]);
        const sortedProfile2 = [...userResult2.profile].sort((a, b) => b[1] - a[1]);

        const maxVal1 = sortedProfile1[0][1]
        const maxVal2 = sortedProfile2[0][1]

        return Math.round(maxVal1 - maxVal2 >= 0 ? maxVal2 / maxVal1 : maxVal1 / maxVal2) * unit.factor;
    }

    //Взаимное понимание
    function getUnderstanding(): number {
        let result = 1; // init result value
        const fraction = result / octants1.length

        for (let i = 0; i < octants1.length; i++) {
            if ((octants1[i].value === 0 && octants2[i].value !== 0) || (octants1[i].value !== 0 && octants2[i].value === 0)) {
                result -= fraction
            }
        }
        return result * unit.factor
    }

    //Взаимное притяжение
    function getAttraction() {
        return false
    }

    //Сходство жизненных установок
    function getLifeAttitudes() {
        //initial value
        const log: string[] = [];

        //Получаем буквенные индексы в разрезе полушарий
        const indexes = [[...userResult1.letterIndexes.slice(0,4)], [...userResult1.letterIndexes.slice(4)]];

        const leadSegment1 = userResult1.sortedOctants[0]
        const leadSegment2 = userResult2.sortedOctants[0]

        //For testing
        // const leadSegment1 = {title: "индивидуал", value: 22.63, index: "A1"}
        // const leadSegment2 = {title: "модник", value: 12.63, index: "B2"}

        if (leadSegment1.index === leadSegment2.index) {
            log.push('1. Ведущие сегменты совпадают; 100%')
            return unit.factor
        }

        if (leadSegment1.index[0] === leadSegment2.index[0]) {
            log.push('2. Ведущие сегменты в одной четверти; 50%')
            return 0.5 * unit.factor
        }

        if ((indexes[0].includes(leadSegment1.index) && indexes[0].includes(leadSegment2.index)) || (indexes[1].includes(leadSegment1.index) && indexes[1].includes(leadSegment2.index))) {
            log.push('2. Ведущие сегменты в одном полушарии; 25%')
            return 0.25 * unit.factor
        }

        makeLog(log);

        return .1 * unit.factor
    }


    // function getPsychotypesCombination(): string[] {
    //     type PLT = [string, number][]
    //     const psychotypesList1: PLT = userResult1.getCalculatedOctants().map(({title, value}) => {
    //         return [title, value]
    //     });
    //     const psychotypesList2: PLT = userResult2.getCalculatedOctants().map(({title, value}) => {
    //         return (value === 0) ? [title, 10000] : [title, value]
    //     });
    //
    //     const result = psychotypesList1.map((item, index) => {
    //         return (item[0], (item[1] / psychotypesList2[index][1]).toFixed(2))
    //     })
    //
    //     return [
    //         'Совмещение психотипов в характере',
    //         `Отношение составляющих характера ${userName1} к ${userName2}:</br>
    //         Индивидуализм - ${result[0]},</br>
    //         Инноваторство - ${result[1]},</br>
    //         Стремление к лидерству во мнении - ${result[2]},</br>
    //         Стремление к модным тенденциям - ${result[3]},</br>
    //         Консерватизм - ${result[4]},</br>
    //         Чувствительность - ${result[5]},</br>
    //         Замкнутость - ${result[6]},</br>
    //         Реализм - ${result[7]}`
    //     ]
    // }

    function getComplementarity() {
        const indexes = userResult1.letterIndexes
        const indexOfSegment1 = indexes.indexOf(userResult1.sortedOctants[0].index)
        const indexOfSegment2 = indexes.indexOf(userResult2.sortedOctants[0].index)

        return [
            'Дополняемость', `${userName1} ${complementarity[indexOfSegment1]}.</br> ${userName2} ${complementarity[indexOfSegment2]}`
        ]
    }


    function makeLog(data: string[]) {
        console.log(data)
        dispatch(saveLog(data))
    }
}

export default PairCoopOutput;