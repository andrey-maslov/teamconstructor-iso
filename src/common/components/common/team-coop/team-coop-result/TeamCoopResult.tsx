import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {
    GlobalStateType,
    IDescWithRange,
    IEmployeeProfile,
    ITeamProfile,
    OctantType
} from "../../../../../constants/types"
import Box from "../../layout/box/Box"
import {SchemeType, UserResult, resultType} from "../../../../../UserResult"
import RadarChart from "../../charts/radar-chart/RadarChart"
import KeyIndicator from "../../pair-coop/pair-coop-output/key-indicator/KeyIndicator"
import ComparisonTable from "../../pair-coop/pair-coop-output/comparison-table/ComparisonTable"
import {complementarityDesc} from '../../pair-coop/pair-coop-output/PairCoopOutput'
import {getDescByRange, toPercent} from "../../../../../helper/helper";

const commitmentDesc: Array<IDescWithRange> = [
    {
        desc: 'Ответственность команды выражена слабо',
        range: [-Infinity, 0]
    },
    {
        desc: 'Ответственность есть',
        range: [0, 3]
    },
    {
        desc: 'Ответсвенность повышенная',
        range: [3, 6]
    },
    {
        desc: 'Ответственность большая',
        range: [6, Infinity]
    }
]

const loyaltyDesc: Array<IDescWithRange> = [
    {
        desc: 'Группа не управляемая, конфликтная',
        range: [-Infinity, .3],
    },
    {
        desc: 'Группа нестабильная, сложноуправляемая, не сплоченная',
        range: [.3, .7],
    },
    {
        desc: 'Группа сплоченная, неконфликтная, управляемая',
        range: [.7, 1.2],
    },
    {
        desc: 'Группа пассивная, требует постоянного управления',
        range: [1.2, 1.5],
    },
    {
        desc: 'Группа, требующая включения лидера',
        range: [1.5, Infinity],
    }
]

const TeamCoopResult: React.FC = () => {

    const activeTeamInd: number     = useSelector((state: GlobalStateType) => state.teamCoopReducer.activeTeam)
    const randomNum: number         = useSelector((state: GlobalStateType) => state.teamCoopReducer.randomNum)
    const activeTeam: ITeamProfile  = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams[activeTeamInd + 1])
    const schemeCurrent: SchemeType = useSelector((state: GlobalStateType) => state.termsReducer.terms)

    const [isReady, setReady]       = useState(false)

    useEffect(() => {
        if (activeTeam && (activeTeam.items.length !== 0 && schemeCurrent)) {
            setReady(true)
        }
    }, [activeTeam, randomNum, schemeCurrent, activeTeamInd])

    if (!activeTeam || activeTeam.items.length === 0) {
        return null
    }

    if (activeTeam.items.length < 3 || activeTeam.items.length > 9) {
        return <div className="" style={{textAlign: 'center'}}>Количество участников команды должно быть от 3 до 9</div>
    }

    const testResults = activeTeam.items.map((item: IEmployeeProfile) => {
        return item.decData[1]
    })

    const fullProfiles = testResults.map((item: resultType) => {
        return new UserResult(item, schemeCurrent)
    })

    const profiles         = fullProfiles.map((profile: any) => profile.profile)
    const names            = activeTeam.items.map((item: IEmployeeProfile) => item.name);

    const teamProfile      = getTeamProfile(profiles)
    const teamOctants      = fullProfiles[0].getCalculatedOctants(teamProfile)
    const sortedOctantsArr = fullProfiles.map((item: any) => item.sortedOctants)
    const maxSectorSq      = getMaxSectorSquare(teamProfile)

    const stability        = getStability(teamOctants, maxSectorSq)
    const interaction      = getInteraction(sortedOctantsArr)
    const emotionalComp    = getEmotionalComp(teamOctants)
    const loyalty          = getLoyalty(teamProfile)
    const leader           = getRoleByType(1)
    const opinionLeader    = getRoleByType(2)
    const commitment       = getCommitment()
    const psyProfile       = getTeamPsyProfile(maxSectorSq, complementarityDesc)
    const needList         = getNeed(maxSectorSq)

    const keyValues = [
        {
            title: 'Стабильность',
            description: '',
            value: stability
        },
        {
            title: 'Способность к взаимодействию',
            description: '',
            value: interaction
        },
        {
            title: 'Эмоциональная совместимость',
            description: '',
            value: emotionalComp
        },
    ]
    const resultTableData = getResultTableData()


    return (
        <>
            {isReady &&
            <div className={'result-wrapper'} id="teamResult">

                <div className={'result-area flex-row'}>
                    <Box
                        addClass="team-radar"
                        title={`${activeTeam.label}. Профили участников`}
                    >
                        {profiles.length !== 0 && <RadarChart profiles={profiles} names={names}/>}
                    </Box>
                    <Box
                        addClass="team-keys"
                        title={`${activeTeam.label}. Ключевые показатели`}
                    >
                        {keyValues.map((item, i) => (
                            <KeyIndicator
                                key={i}
                                title={item.title}
                                description={item.description}
                                value={item.value}
                            />
                        ))}
                    </Box>
                </div>

                <div className={'result-area flex-row'}>
                    <Box
                        addClass="team-radar"
                        title={`${activeTeam.label}. Общий профиль`}
                    >
                        {profiles.length !== 0 && <RadarChart profiles={[teamProfile]} names={[activeTeam.label]}/>}
                    </Box>
                    <Box
                        addClass="team-keys"
                        title={`${activeTeam.label}. Сводная таблица`}
                    >
                        <ComparisonTable tableData={resultTableData}/>
                    </Box>
                </div>
            </div>
            }
        </>
    );

    function getTeamProfile(profiles: [string, number][][]) {
        const arrSum: any = [[], [], [], [], [], [], [], []];
        const count = profiles.length;

        for (let i = 0; i < count; i++) {
            for (let k = 0; k < 8; k++) {
                arrSum[k].push(profiles[i][k][1])
            }
        }

        return arrSum.map((item: number[], i: number) => {
            const sum = item.reduce((a, b) => a + b)
            return [profiles[0][i][0], Number((sum / count).toFixed(1))]
        })
    }

    function getMaxSectorSquare(profile: [string, number][]): number {
        const values = profile.map(item => item[1])
        const max = Math.max.apply(null, values);
        return (max * max * .7) / 2  // .7 -> sin(45deg); 45 deg -> angle between octant sides;
    }

    function getStability(octants: OctantType[], maxSectorSq: number): number {

        if (maxSectorSq === 0) {
            return -1
        }

        const maxCircleSquare = maxSectorSq * 8 // 8 -> number of octants in full circle
        const factCircleSquare = octants.map(item => item.value).reduce((a, b) => a + b);

        return factCircleSquare / maxCircleSquare
    }

    function getInteraction(sortedProfiles: OctantType[][]): number {
        const allMaxValues = sortedProfiles.map(item => item[0].value)
        const max = Math.max.apply(null, allMaxValues)
        const min = Math.min.apply(null, allMaxValues)
        return min / max
    }

    function getEmotionalComp(octants: OctantType[]): number {
        const values = octants.map(octant => octant.value)
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

    function getLoyalty(profile: [string, number][]): number {

        const values = profile.map(item => item[1])
        const topSum = [values[0], values[1], values[7]].reduce((a, b) => a + b)
        const bottomSum = values.slice(3, 6).reduce((a, b) => a + b)

        if (bottomSum === 0) {
            return topSum / 0.1
        }
        return topSum / bottomSum

    }

    //typeInd = number from 1 to 8 of octants. Leader role equals Innovator type, for example
    function getRoleByType(typeInd: number): string {
        const octantsByMember: OctantType[] = fullProfiles.map((profile: any) => profile.getCalculatedOctants())
        const values = octantsByMember.map(octant => octant[typeInd].value)
        const max = Math.max.apply(null, values)

        const indexOfMax = values.indexOf(max)

        if (indexOfMax === -1) {
            return 'ERROR'
        }
        return names[indexOfMax]
    }

    function getCommitment(): number {
        //list item = value of responsibility of one member from data block "Привязанность-отдельность"
        const respValsList: number[] = activeTeam.items.map((item: IEmployeeProfile) => item.decData[1][3][0])
        return respValsList.reduce((a, b) => a + b)
    }

    function getTeamPsyProfile(maxSectorSq: number, descList: string[]): string {
        // const majorOctants: OctantType[] = teamOctants.filter((item: OctantType) => item.value >= maxSectorSq / 2)
        const descIndList: number[] = []
        for (let i = 0; i < 8; i++) {
            if (teamOctants[i].value >= maxSectorSq / 2) {
                descIndList.push(i)
            }
        }
        if (descIndList.length === 0) {
            return 'ERROR'
        }
        const desc = descIndList.map(index => descList[index]).join(', ')

        return `Команда характеризуется такими качествами как ${desc}`
    }

    function getNeed(maxSectorSq: number): string[] {
        const minorOctants: OctantType[] = teamOctants.filter((item: OctantType) => item.value < maxSectorSq * .15)
        return minorOctants.map(item => item.title)
    }

    function getResultTableData() {
        return [
            ['Стабильность',                                toPercent(stability).str],
            ['Способность к взаимодействию (коммуникации)', toPercent(interaction).str],
            ['Эмоциональная совместимость',                 toPercent(emotionalComp).str],
            ['Лояльность к внешнему руководству',           getDescByRange(loyalty, loyaltyDesc)],
            ['Ответственность команды',                     getDescByRange(commitment, commitmentDesc)],
            ['Психологический профиль команды',             psyProfile],
            ['Лидер команды',                               leader],
            ['Альтернативный лидер',                        opinionLeader],
            ['Типы, рекомендуемые в команду',               needList.join(', ')],
        ]
    }

}

export default TeamCoopResult;