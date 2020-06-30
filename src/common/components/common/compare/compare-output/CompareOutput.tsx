import React, {useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {UserResult, SchemeType} from '../../../../../UserResult';
import {useTranslation} from "react-i18next";
import Charts from "./charts/Charts";
import Box from "../../layout/box/Box";
import Table from "../../tables/table/Table";
import ComparisonTable from "./comparison-table/ComparisonTable";
import {PersonalInfoType, TestResultType, FullResultType} from '../../../../../constants/types';

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

interface ICompareOutputProps {
    // schemeCurrent: SchemeType
}

const CompareOutput: React.FC<ICompareOutputProps> = () => {

    //Initial data
    const schemeCurrent: SchemeType = useSelector((state: any) => state.termsReducer.terms)
    const isCompareReady: boolean = useSelector((state: any) => state.compareReducer.isComparisonResultReady)
    const userData1: any = useSelector((state: any) => state.compareReducer.user1.data)
    const userData2: any = useSelector((state: any) => state.compareReducer.user2.data)
    const dispatch = useDispatch()

    if (!isCompareReady) {
        return null;
    }

    const {t} = useTranslation();

    const userResult1 = useMemo(() => new UserResult(userData1[1], schemeCurrent), [userData1, schemeCurrent])
    const userResult2 = useMemo(() => new UserResult(userData2[1], schemeCurrent), [userData2, schemeCurrent])


    //tmp
    const userProfile1 = userResult1.profile
    const userProfile2 = userResult2.profile

    const comparisonTableData = getComparisonTableData()

    const compatibility = getCompatibility()

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
                            tableData={[['user 1', ...userData1[1][3]], ['user 2', ...userData2[1][3]]]}
                            tableHeader={['', ...(schemeCurrent.axes[3].subAxes).map(item => item.join(' - '))]}
                        />
                    </div>
                </div>
            </Box>

            {/*<Box className='result-box full-profile'>*/}
            {/*    <h4>Users profiles</h4>*/}
            {/*    <div className="row around-md">*/}
            {/*        <div className="col-md-6 col-lg-5">*/}
            {/*            <strong>User 1</strong>*/}
            {/*            <Table*/}
            {/*                tableData={userProfile1}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className="col-md-6 col-lg-5">*/}
            {/*            <strong>User 2</strong>*/}
            {/*            <Table*/}
            {/*                tableData={userProfile2}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Box>*/}

            {/*<Box className='result-box additional-profile'>*/}
            {/*    <h4>Users sorted octants</h4>*/}
            {/*    {userResult1.octantsTitles.join(' / ')}*/}
            {/*    <div className="row around-md">*/}
            {/*        <div className="col-md-6 col-lg-5">*/}
            {/*            <strong>User 1</strong>*/}
            {/*            <Table*/}
            {/*                tableData={userResult1.getCalculatedOctants().map(item => [item.title, item.value])}*/}
            {/*                tableHeader={['октант', 'значение']}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className="col-md-6 col-lg-5">*/}
            {/*            <strong>User 2</strong>*/}
            {/*            <Table*/}
            {/*                tableData={userResult2.getCalculatedOctants().map(item => [item.title, item.value])}*/}
            {/*                tableHeader={['октант', 'значение']}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Box>*/}
        </div>
    );

    function getComparisonTableData() {

        //Получаем сравнение комплексных характеристик
        const complexDataComparison = getComplexDataComparison();

        //Получаем вывод о соотношении интенсивностей
        const intensityRatioComparison: any = getIntensityRatioComparison().tableData

        //Получаем совмещение психотипов в характере
        const psychotypesCombination = useMemo(() => getPsychotypesCombination(), [userProfile1, userProfile2]);

        //
        const complementarity = getComplementarity()

        //
        const affectionSeparationData = getAffectionSeparationData()

        const compatibility = getCompatibility()

        const commonComplexData: string[][] = [
            intensityRatioComparison,
            psychotypesCombination,
            ...complexDataComparison,
            complementarity,
            ...affectionSeparationData,
            ['Вероятность длительного сотрудничества', `${compatibility}%`]
        ]

        return commonComplexData
    }

    function getComplexDataComparison() {
        const complexData1 = userResult1.getComplexData()
        const complexData2 = userResult2.getComplexData()

        return [
            [complexData1[3][0], `${complexData1[3][0]} Профиль 1 - ${complexData1[3][1]},</br> ${complexData1[3][0]} Профиль 2 - ${complexData2[3][1]}`],
            [complexData1[4][0], `${complexData1[4][0]} Профиль 1 - ${complexData1[4][1]},</br> ${complexData1[4][0]} Профиль 2 - ${complexData2[4][1]}`],
            [complexData1[6][0], `${complexData1[6][0]} Профиль 1 - ${complexData1[6][1]},</br> ${complexData1[6][0]} Профиль 2 - ${complexData2[6][1]}`],
        ]
    }

    //Вывод о соотношении интенсивности ведущих тенденций (у каждого профиля по одной). Разница в процентах
    function getIntensityRatioComparison(): { ratio: number, tableData: string[] } {
        const checkValues: number[] = [25, 40];
        const conclusions: string[] = ['Характеры совместимы', 'Совместимость затруднена', 'Совместимость характеров проходит очень сложно']
        const label = 'Интенсивность основных тенденций'

        const sortedProfile1 = [...userResult1.profile].sort((a, b) => b[1] - a[1]);
        const sortedProfile2 = [...userResult2.profile].sort((a, b) => b[1] - a[1]);

        const maxValue1 = sortedProfile1[0][1]
        const maxValue2 = sortedProfile2[0][1]

        let diff: number | null = null;
        let users: string[] = ['Пользователь 1', 'Пользователь 2'];

        if ((maxValue1 - maxValue2) >= 0) {
            diff = Math.round((1 - maxValue2 / maxValue1) * 100)
        } else {
            diff = Math.round((1 - maxValue1 / maxValue2) * 100);
            users = ['Пользователь 2', 'Пользователь 1']
        }

        if (diff < checkValues[0]) {
            return {
                ratio: diff,
                tableData: [label, `У ${users[0]} свойства характера проявляется более интенсивно,чем у ${users[1]}, на ${diff}%. ${conclusions[0]}`]
            }
        }
        if (diff > checkValues[2]) {
            return {
                ratio: diff,
                tableData: [label, `У ${users[0]} свойства характера проявляется более интенсивно,чем у ${users[1]}, на ${diff}%. ${conclusions[2]}`]
            }
        }

        return {
            ratio: diff,
            tableData: [label, `У ${users[0]} свойства характера проявляется более интенсивно,чем у ${users[1]}, на ${diff}%. ${conclusions[1]}`]
        }
    }

    function getPsychotypesCombination(): string[] {
        type PLT = [string, number][]
        const psychotypesList1: PLT = userResult1.getCalculatedOctants().map(({title, value}) => {
            return [title, value]
        });
        const psychotypesList2: PLT = userResult2.getCalculatedOctants().map(({title, value}) => {
            return (value === 0) ? [title, 10000] : [title, value]
        });

        const result = psychotypesList1.map((item, index) => {
            return (item[0], (item[1] / psychotypesList2[index][1]).toFixed(2))
        })

        return [
            'Совмещение психотипов в характере',
            `Отношение составляющих характера Пользователя 1 к Пользователю 2:</br>
            Индивидуализм - ${result[0]},</br> 
            Инноваторство - ${result[1]},</br> 
            Стремление к лидерству во мнении - ${result[2]},</br> 
            Стремление к модным тенденциям - ${result[3]},</br>
            Консерватизм - ${result[4]},</br>
            Чувствительность - ${result[5]},</br>
            Замкнутость - ${result[6]},</br>
            Реализм - ${result[7]}`
        ]
    }

    function getComplementarity() {
        const indexes = userResult1.letterIndexes
        const indexOfSegment1 = indexes.indexOf(userResult1.sortedOctants[0].index)
        const indexOfSegment2 = indexes.indexOf(userResult2.sortedOctants[0].index)

        return [
            'Дополняемость', `Пользователь 1 ${complementarity[indexOfSegment1]}.</br> Пользователь 2 ${complementarity[indexOfSegment2]}`
        ]
    }

    //Вывод по диапазону "привязанность-отдельность"
    function getAffectionSeparationData() {

        const labels = schemeCurrent.axes[3].subAxes;

        const data1 = userData1[1][3];
        const data2 = userData2[1][3];

        //TODO добавить обработку 0; обойтись без цифр "Пользователь 1 склонен к принятию контроля..."
        //Принятие отношений, 2 последних поля в таблице
        const relationsTemplate = `У Пользователя 1 ${data1[3] < -0 ? labels[3][0] : labels[3][1]} = ${Math.abs(data1[3])}, ${data1[4] < -0 ? labels[4][0] : labels[4][1]} = ${Math.abs(data1[4])}, 
                                    у Пользователя 2 - ${data2[3] < -0 ? labels[3][0] : labels[3][1]} = ${Math.abs(data2[3])}, ${data2[4] < -0 ? labels[4][0] : labels[4][1]} = ${Math.abs(data2[4])}`

        //поле избегание ответственности - ответственность
        const responsibilityTemplate = `У Пользователя 1 ${data1[0] < -0 ? labels[0][0] : labels[0][1]} = ${Math.abs(data1[0])}, у Пользователя 2 - ${data2[0] < -0 ? labels[0][0] : labels[0][1]} = ${Math.abs(data2[0])}`

        //поле невротизам - стабильность
        const stabilityTemplate = `У Пользователя 1 ${data1[2] < -0 ? labels[2][0] : labels[2][1]} = ${Math.abs(data1[2])}, у Пользователя 2 - ${data2[2] < -0 ? labels[2][0] : labels[2][1]} = ${Math.abs(data2[2])}`

        //поле притяние контроля - не принятие контроля
        const controlTemplate = `У Пользователя 1 ${data1[1] < -0 ? labels[1][0] : labels[1][1]} = ${Math.abs(data1[1])}, у Пользователя 2 - ${data2[1] < -0 ? labels[1][0] : labels[1][1]} = ${Math.abs(data2[1])}`

        return [
            ['Принятие отношений', relationsTemplate],
            ['Отвественность', responsibilityTemplate],
            ['Стабильность', stabilityTemplate],
            ['Взаимный контроль', controlTemplate]
        ]
    }

    //Совместимость типов характера
    function getCompatibility(): number {

        //initial value
        let value = 0;
        const leadSegment1 = userResult1.sortedOctants[0]
        const leadSegment2 = userResult2.sortedOctants[0]

        //For testing
        // const leadSegment1 = {title: "индивидуал", value: 22.63, index: "A1"}
        // const leadSegment2 = {title: "модник", value: 12.63, index: "b2"}

        const intensityRatio: any = getIntensityRatioComparison().ratio

        console.group('совместимость')

        if (intensityRatio < 25) {
            value += .3
        }

        //если ведущие сегменты - соседние, то + .1
        const letterIndexes = userResult1.letterIndexes
        const index1 = letterIndexes.indexOf(leadSegment1.index); //3
        const index2 = letterIndexes.indexOf(leadSegment2.index); //4

        if(Math.abs(index1 - index2) === 1 || Math.abs(index1 - index2) === (letterIndexes.length - 1)) {
            value += .1
            console.log('сегменты соседние')
        }


        //если ведущие сегменты в пределах одной четверти, то + .1
        if (leadSegment1.index[0] === leadSegment2.index[0]) {
            value += .1
            console.log('сегменты в одной четверти')
        }

        //TODO если ведущие сегменты равны...
        if (leadSegment1.index === leadSegment2.index) {
            value += 0
            console.log('Ведущие сегменты равны')
        }


        //Данные секции "Привязанность-отдельность" - Affection-Separation - в одном массиве
        const affSep = [userData1[1][3], userData2[1][3]]

        //Если у обоих положительное значение "Принятие ответственности", то + .1
        if (affSep[0][0] >= 0 && affSep[1][0] >= 0) {
            console.log('Принятие ответственности у обоих')
            value += .1
        }

        //Если у одного из пары присутствует избегание отвественности, а у другого присутствует Принятие ответственности,
        // и принятие ответственности больше  или равно по абсолютному значению, чем избегание, то + .05
        if ((affSep[0][0] < 0 && affSep[1][0] >= 0) && affSep[1][0] >= Math.abs(affSep[0][0])) {
            value += .05
            console.log('adoption more 2')
        }
        if ((affSep[0][0] >= 0 && affSep[1][0] < 0) && affSep[0][0] >= Math.abs(affSep[1][0])) {
            value += .05
            console.log('adoption more 1')
        }

        //Если у одного из пары присутствует избегание отвественности, а у другого присутствует принятие ответственности,
        // и Принятие ответственности меньше по абсолютному значению, чем избегание, то + 0
        if ((affSep[0][0] < 0 && affSep[1][0] >= 0) && affSep[1][0] < Math.abs(affSep[0][0])) {
            value += 0
            console.log('avoidance more 1')
        }
        if ((affSep[0][0] >= 0 && affSep[1][0] < 0) && affSep[0][0] < Math.abs(affSep[1][0])) {
            value += 0
            console.log('avoidance more 2')
        }

        //Если у обоих присутствует "Избегание ответственности", то - 0.1
        if (affSep[0][0] < 0 && affSep[1][0] < 0) {
            value -= .1
            console.log('avoidance twice')
        }

        //= + 0.1
        if (affSep[0][2] >= 0 && affSep[1][2] >= 0) {
            value += .1
            console.log('Стабильность у обоих')
        }

        //Если у одного из пары присутствует невротизм, а у другого присутствует стабильность,
        // и оно больше или равно по абсолютному значению, чем невротизм, то + 0.05
        if ((affSep[0][2] < 0 && affSep[1][2] >= 0) && affSep[1][2] >= Math.abs(affSep[0][2])) {
            value += .05
            console.log('У первого невротизм, но стабильность второго больше')
        }
        if ((affSep[1][2] < 0 && affSep[0][2] >= 0) && affSep[0][2] >= Math.abs(affSep[1][2])) {
            value += .05
            console.log('У второго невротизм, но стабильность первого больше')
        }


        //Если у одного из пары присутствует невротизм, а у другого присутствует стабильность,
        // и она мненьше по абсолютному значению, чем невротизм, то + 0
        if ((affSep[0][2] < 0 && affSep[1][2] >= 0) && affSep[1][2] < Math.abs(affSep[0][2])) {
            value += .05
            console.log('У первого невротизм, и стабильность второго меньше')
        }
        if ((affSep[1][2] < 0 && affSep[0][2] >= 0) && affSep[0][2] < Math.abs(affSep[1][2])) {
            value += .05
            console.log('У второго невротизм, и стабильность первого меньше')
        }


        //Если у одного из пары склонность к принятию отношений, а удругого - склонность к установлению отношений
        // и они по значению больше или равно 2, то + 0.1
        if ((affSep[0][3] >= 0 && affSep[1][4] < 0) && (affSep[0][3] >= 2 && Math.abs(affSep[1][4]) >= 2)) {
            value += .1
            console.log('У 1 - принятие отнош, у 2 установл отнош и они больше 2')
        }
        if ((affSep[1][3] >= 0 && affSep[0][4] < 0) && (Math.abs(affSep[0][4]) >= 2 && affSep[1][3] >= 2)) {
            value += .1
            console.log('У 1 - установл отнош, у 2 принятие отнош и они больше 2')
        }

        //
        if ((affSep[0][3] >= 0 && affSep[1][4] >= 0) || (affSep[1][3] >= 0 && affSep[0][4] >= 0)) {
            value += .05
            console.log('12 пункт сработал')
        }

        // Если у одного из пары равны положительные цифры в принятии отношений с положительными цифрами установления отношений у другого партнера, то + .1
        if ((affSep[0][3] >= 0 && affSep[1][4] >= 0) && (affSep[0][3] === affSep[1][4])) {
            value += .1
        }
        if ((affSep[1][3] >= 0 && affSep[0][4] >= 0) && (affSep[1][3] === affSep[0][4])) {
            value += .1
        }

        console.groupEnd()

        return Math.round(value * 100)
    }
}

export default CompareOutput;