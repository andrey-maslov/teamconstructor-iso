import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {GlobalStateType, IEmployeeProfile, ITeamProfile, OctantType} from "../../../../../constants/types"
import Box from "../../layout/box/Box"
import {SchemeType, UserResult, resultType} from "../../../../../UserResult"
import RadarChart from "../../charts/radar-chart/RadarChart"
import KeyIndicator from "../../pair-coop/pair-coop-output/key-indicator/KeyIndicator"
import ComparisonTable from "../../pair-coop/pair-coop-output/comparison-table/ComparisonTable";


const loyaltyDesc = [
    "группа не управляемая, конфликтная",
    "группа нестабильная, сложноуправляемая, не сплоченная",
    "группа сплоченная, неконфликтная, управляемая",
    "группа пассивная, требует постоянного управления",
    "руппа, требующая включения лидера"
]

const TeamCoopResult: React.FC = () => {

    const activeTeamInd: number     = useSelector((state: GlobalStateType) => state.teamCoopReducer.activeTeam)
    const randomNum: number         = useSelector((state: GlobalStateType) => state.teamCoopReducer.randomNum)
    const activeTeam: ITeamProfile  = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams[activeTeamInd + 1])
    const schemeCurrent: SchemeType = useSelector((state: GlobalStateType) => state.termsReducer.terms)
    const [isReady, setReady]       = useState(false)

    const unit = {factor: 100, sign: '%'}

    useEffect(() => {
        if (activeTeam && (activeTeam.items.length !== 0 && schemeCurrent)) {
            setReady(true)
        }
    }, [activeTeam, randomNum, schemeCurrent, activeTeamInd])

    if (!activeTeam || activeTeam.items.length === 0) {
        return null
    }

    if (activeTeam.items.length < 2 || activeTeam.items.length > 9) {
        return <div className="" style={{textAlign: 'center'}}>Количество участников команды должно быть от 2 до 9</div>
    }

    const testResults = activeTeam.items.map((item: IEmployeeProfile) => {
        return item.decData[1]
    })

    const fullProfiles = testResults.map((item: resultType) => {
        return new UserResult(item, schemeCurrent)
    })

    const profiles = fullProfiles.map((profile: any) => profile.profile)
    const names = activeTeam.items.map((item: IEmployeeProfile) => item.name);

    const teamProfile = getTeamProfile(profiles)
    const teamOctants = fullProfiles[0].getCalculatedOctants(teamProfile)
    const sortedOctantsArr = fullProfiles.map((item: any) => item.sortedOctants)

    const stability = getStability(teamProfile, teamOctants)
    const interaction = getInteraction(sortedOctantsArr)
    const emotionalComp = getEmotionalComp(teamOctants)
    const loyalty = getLoyalty(teamProfile)
    const leader =  getRoleByType(1)
    const opinionLeader =  getRoleByType(2)

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
            <div className={'result-wrapper'}>

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

    function getStability(profile: [string, number][], octantsValues: OctantType[]):  number {
        const values = profile.map(item => item[1])
        const max = Math.max.apply(null, values);

        if (max === 0) {
            return -1
        }

        const maxCircleSquare = (max * max * .7)  / 2 * 8 // .7 -> sin(45deg); 45 deg -> angle between octant sides; 8 -> number of octants in full circle
        const factCircleSquare = octantsValues.map(item => item.value).reduce((a, b) => a + b);

        return factCircleSquare / maxCircleSquare * unit.factor
    }

    function getInteraction(sortedProfiles: OctantType[][]): number {
        const allMaxValues = sortedProfiles.map(item => item[0].value)
        const max = Math.max.apply(null, allMaxValues)
        const min = Math.min.apply(null, allMaxValues)
        return min / max * unit.factor
    }

    function getEmotionalComp(octants: OctantType[]): number {
        const values = octants.map(octant => octant.value)
        const rightSum = values.slice(0, 4).reduce((a,b) => a+ b)
        const leftSum = values.slice(4).reduce((a,b) => a+ b)
        if (leftSum === 0) {
            return -1
        }
        if (rightSum === 0) {
            return -1
        }
        return (leftSum <= rightSum) ? leftSum / rightSum * unit.factor : rightSum / leftSum * unit.factor
    }

    // get loyalty value
    function getLoyalty(profile: [string, number][]): number {

        const values = profile.map(item => item[1])
        const topSum = [values[0], values[1], values[7]].reduce((a, b) => a + b)
        const bottomSum = values.slice(3, 6).reduce((a, b) => a + b)

        if (bottomSum === 0) {
            return topSum / 0.1
        }
        return topSum / bottomSum
    }

    //typeInd = number from 1 to 8 of octants
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

    function getResultTableData() {

        return [
            ['Стабильность', `${stability.toFixed()}${unit.sign}`],
            ['Способность к взаимодействию (коммуникации)', `${interaction.toFixed()}${unit.sign}`],
            ['Эмоциональная совместимость', `${emotionalComp.toFixed()}${unit.sign}`],
            ['Лояльность к внешнему руководству', loyalty.toFixed(2)],
            ['Лидер команды', leader],
            ['Альтернативный лидер', opinionLeader],
        ]
    }

}

export default TeamCoopResult;