import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {
    GlobalStateType,
    IEmployeeProfile,
    ITeamProfile,
} from "../../../../../constants/types"
import Box from "../../layout/box/Box"
import {UserResult, baseTestResultType, IUserResult, ITendency, IOctant} from "../../../../../UserResult"
import RadarChart from "../../charts/radar-chart/RadarChart"
import KeyIndicator from "../../pair-coop/pair-coop-output/key-indicator/KeyIndicator"
import ComparisonTable from "../../pair-coop/pair-coop-output/comparison-table/ComparisonTable"
import {getDescByRange, toPercent} from "../../../../../helper/helper"

const TeamCoopResult: React.FC = () => {

    const activeTeamInd: number         = useSelector((state: GlobalStateType) => state.teamCoopReducer.activeTeam)
    const randomNum: number             = useSelector((state: GlobalStateType) => state.teamCoopReducer.randomNum)
    const activeTeam: ITeamProfile      = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams[activeTeamInd + 1])
    const {terms: scheme, descriptions} = useSelector((state: GlobalStateType) => state.termsReducer)

    //if all resources are fetched, calculated and ready to display
    const [isReady, setReady]      = useState(false)

    useEffect(() => {
        if (activeTeam && (activeTeam.items.length !== 0 && scheme)) {
            setReady(true)
        }
    }, [activeTeam, randomNum, scheme, activeTeamInd])

    if (!isReady) {
        return null
    }

    if (activeTeam.items.length < 3 || activeTeam.items.length > 9) {
        return <div className="" style={{textAlign: 'center'}}>Количество участников команды должно быть от 3 до 9</div>
    }

    const testResultList = activeTeam.items.map((item: IEmployeeProfile) => {
        return item.decData[1]
    })

    const fullProfiles: IUserResult[] = testResultList.map((item: baseTestResultType) => {
        return new UserResult(item)
    })

    const profiles          = fullProfiles.map((profile: any) => profile.profile)
    const names             = activeTeam.items.map((item: IEmployeeProfile) => item.name);

    const teamProfile       = getTeamProfile(profiles)
    const teamPortrait      = UserResult.getPortrait(teamProfile)
    const sortedOctantsArr  = fullProfiles.map((item: any) => item.sortedOctants)
    const maxSectorSq       = getMaxSectorSquare(teamProfile)

    const stability         = getStability(teamPortrait, maxSectorSq)
    const interaction       = getInteraction(sortedOctantsArr)
    const emotionalComp     = getEmotionalComp(teamPortrait)
    const loyalty           = getLoyalty(teamProfile)
    const leaderName        = names[getLeadingMemberByType(1)]
    const opinionLeaderName = names[getLeadingMemberByType(2)]
    const commitment        = getCommitment()
    const teamProfileDesc   = getProfileDesc(maxSectorSq, descriptions.complementarityDesc)
    const needList          = getNeed(maxSectorSq)

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
                        title={`${activeTeam.title}. Профили участников`}
                    >
                        {profiles.length !== 0 &&
                        <RadarChart
                            profiles={profiles}
                            names={names}
                            labels={scheme.tendencies}
                        />}
                    </Box>
                    <Box
                        addClass="team-keys"
                        title={`${activeTeam.title}. Ключевые показатели`}
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
                        title={`${activeTeam.title}. Общий профиль`}
                    >
                        {profiles.length !== 0 &&
                        <RadarChart
                            profiles={[teamProfile]}
                            names={[activeTeam.title]}
                            labels={scheme.tendencies}
                        />}
                    </Box>
                    <Box
                        addClass="team-keys"
                        title={`${activeTeam.title}. Сводная таблица`}
                    >
                        <ComparisonTable tableData={resultTableData}/>
                    </Box>
                </div>
            </div>
            }
        </>
    );

    function getTeamProfile(profiles: ITendency[][]) {
        const arrSum: any = [[], [], [], [], [], [], [], []];
        const count = profiles.length;

        for (let i = 0; i < count; i++) {
            for (let k = 0; k < 8; k++) {
                arrSum[k].push(profiles[i][k].value)
            }
        }

        return arrSum.map((item: number[], i: number) => {
            const sum = item.reduce((a, b) => a + b)
            return {index: i, value: Number((sum / count).toFixed(1))}
        })
    }

    function getMaxSectorSquare(profile: ITendency[]): number {
        const values = profile.map(item => item.value)
        const max = Math.max.apply(null, values);
        return (max * max * .7) / 2  // .7 -> sin(45deg); 45 deg -> angle between octant sides;
    }

    function getStability(portrait: IOctant[], maxSectorSq: number): number {

        if (maxSectorSq === 0) {
            return -1
        }

        const maxCircleSquare = maxSectorSq * 8 // 8 -> number of octants in full circle
        const factCircleSquare = portrait.map(item => item.value).reduce((a, b) => a + b);

        return factCircleSquare / maxCircleSquare
    }

    function getInteraction(sortedPortraits: IOctant[][]): number {
        const allMaxValues = sortedPortraits.map(item => item[0].value)
        const max = Math.max.apply(null, allMaxValues)
        const min = Math.min.apply(null, allMaxValues)
        return min / max
    }

    function getEmotionalComp(portrait: IOctant[]): number {
        const values = portrait.map(octant => octant.value)
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

    function getLoyalty(profile: ITendency[]): number {

        const values = profile.map(item => item.value)
        const topSum = [values[0], values[1], values[7]].reduce((a, b) => a + b)
        const bottomSum = values.slice(3, 6).reduce((a, b) => a + b)

        if (bottomSum === 0) {
            return topSum / 0.1
        }
        return topSum / bottomSum

    }

    //TODO need to fix
    //typeInd = number from 1 to 8 of octants. Leader role equals Innovator type, for example
    function getLeadingMemberByType(typeInd: number): number {
        const portraitList: IOctant[][] = fullProfiles.map((item: any) => item.portrait)
        const values = portraitList.map(octant => octant[typeInd].value)
        const max = Math.max.apply(null, values)

        return values.indexOf(max)
    }

    function getCommitment(): number {
        //list item = value of responsibility of one member from data block "Привязанность-отдельность"
        const respValsList: number[] = activeTeam.items.map((item: IEmployeeProfile) => item.decData[1][3][0])
        return respValsList.reduce((a, b) => a + b)
    }

    function getProfileDesc(maxSectorSq: number, descList: string[]): string {

        const descIndList: number[] = []
        for (let i = 0; i < 8; i++) {
            if (teamPortrait[i].value >= maxSectorSq / 2) {
                descIndList.push(i)
            }
        }
        if (descIndList.length === 0) {
            return 'ERROR'
        }
        const desc = descIndList.map(index => descList[index]).join(', ')

        return `Команда характеризуется такими качествами как ${desc}`
    }

    function getNeed(maxSectorSq: number): number[] {
        const minorOctants: IOctant[] = teamPortrait.filter((item: IOctant) => item.value < maxSectorSq * .15)
        return minorOctants.map(item => item.index)
    }

    function getResultTableData() {
        return [
            ['Стабильность',                                toPercent(stability).str],
            ['Способность к взаимодействию (коммуникации)', toPercent(interaction).str],
            ['Эмоциональная совместимость',                 toPercent(emotionalComp).str],
            ['Лояльность к внешнему руководству',           getDescByRange(loyalty, descriptions.loyaltyDesc)],
            ['Ответственность команды',                     getDescByRange(commitment, descriptions.commitmentDesc)],
            ['Психологический профиль команды',             teamProfileDesc],
            ['Лидер команды',                               leaderName],
            ['Альтернативный лидер',                        opinionLeaderName],
            ['Типы, рекомендуемые в команду',               needList.map(i => scheme.psychoTypes[i]).join(', ')],
        ]
    }

}

export default TeamCoopResult;