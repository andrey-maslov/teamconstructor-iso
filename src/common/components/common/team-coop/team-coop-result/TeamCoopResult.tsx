import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {GlobalStateType, IMember, ITeam, TableRow} from "../../../../../constants/types"
import Box from "../../layout/box/Box"
import {UserResult, baseTestResultType, IUserResult, ITendency, IOctant} from "../../../../../UserResult"
import RadarChart from "../../charts/radar-chart/RadarChart"
import KeyIndicator from "../../pair-coop/pair-coop-output/key-indicator/KeyIndicator"
import ComparisonTable from "../../pair-coop/pair-coop-output/comparison-table/ComparisonTable"
import {getDescByRange, getKeyResult} from "../../../../../helper/helper"
import TeamDescription from "../../pair-coop/pair-coop-output/description/TeamDescription";

const TeamCoopResult: React.FC = () => {

    const {terms: scheme, descriptions} = useSelector((state: GlobalStateType) => state.termsReducer)
    const teamCoop                      = useSelector((state: GlobalStateType) => state.teamCoopReducer)
    const activeTeamInd: number         = teamCoop.activeTeam
    const randomNum: number             = teamCoop.randomNum
    const activeTeam: ITeam             = teamCoop.teams[activeTeamInd + 1]
    const teamsCount                    = teamCoop.teams.length

    //if all resources are fetched, calculated and ready to display
    const [isReady, setReady]      = useState(false)

    useEffect(() => {
        if (typeof activeTeam !== 'undefined' && scheme && descriptions) {
            setReady(true)
        }
        if (teamsCount === 1 || !scheme || !descriptions) {
            setReady(false)
        }
    }, [randomNum, scheme, activeTeamInd,  teamsCount])

    if (!isReady || teamsCount === 1) {
        return null
    }

    const teamSpec          = teamCoop.teamSpec
    const poolMembers       = teamCoop.teams[0].items
    //FIXME FATAL ERROR when delete last team
    const teamMembers       = activeTeam.items

    if (activeTeam.items.length < 3 || activeTeam.items.length > 9) {
        return <div className="" style={{textAlign: 'center'}}>Количество участников команды должно быть от 3 до 9</div>
    }

    const testResultList = activeTeam.items.map((item: IMember) => {
        return item.decData[1]
    })

    const fullProfiles: IUserResult[] = testResultList.map((item: baseTestResultType) => {
        return new UserResult(item)
    })

    const profiles          = fullProfiles.map((profile: any) => profile.profile)
    const names             = activeTeam.items.map((item: IMember) => item.name);

    const teamProfile       = getTeamProfile(profiles)
    const teamPortrait      = UserResult.getPortrait(teamProfile)
    const sortedOctantsArr  = fullProfiles.map((item: any) => item.sortedOctants)
    const maxSectorSq       = getMaxSectorSquare(teamProfile)
    const allCandidates     = getAllCandidates(poolMembers, teamMembers)

    const crossFunc         = getCrossFunc(teamPortrait, maxSectorSq)
    const interaction       = getInteraction(sortedOctantsArr)
    const emotionalComp     = getEmotionalComp(teamPortrait)
    const loyalty           = getLoyalty(teamProfile)
    const leaderName        = names[getLeadingMemberByType(1)]
    const opinionLeaderName = names[getLeadingMemberByType(2)]
    const commitment        = getCommitment()
    const teamProfileDesc   = getProfileDesc(maxSectorSq, descriptions.complementarityDesc)
    const needList          = getNeed(maxSectorSq)
    const candidates        = getCandidates(teamPortrait, teamSpec, allCandidates)
    const unwanted          = getUnwanted(teamMembers, teamProfile)

    const keyResults = ['', 'хороший результат', 'отличный результат']
    const keyValues  = [
        {
            title: 'Кросс-функциональность',
            description: getKeyResult(crossFunc, keyResults),
            more: 'some text describes this point',
            value: crossFunc
        },
        {
            title: 'Способность к взаимодействию',
            description: getKeyResult(interaction, keyResults),
            more: 'some text describes this point',
            value: interaction
        },
        {
            title: 'Эмоциональная совместимость',
            description: getKeyResult(emotionalComp, keyResults),
            more: 'some text describes this point',
            value: emotionalComp
        },
    ]
    const teamDescriptionData = getResultTableData()

    // console.log(candidates)


    return (
        <>
            {isReady &&
            <div className={'result-wrapper'} id="teamResult">

                <div className={'result-area flex-row'}>
                    <div className="col">
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
                    </div>

                    <div className="col">
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
                                    more={item.more}
                                />
                            ))}
                        </Box>


                        <Box
                            addClass="team-table team-indicators"
                            title={`${activeTeam.title}. Показатели`}
                        >
                            <TeamDescription
                                teamProfile={['Психологический профиль команды', teamProfileDesc]}
                                data={teamDescriptionData}
                            />
                            {/*<ComparisonTable tableData={resultTableData}/>*/}
                        </Box>
                    </div>
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

    function getCrossFunc(portrait: IOctant[], maxSectorSq: number): number {

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
        const respValsList: number[] = activeTeam.items.map((item: IMember) => item.decData[1][3][0])
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
            return 'Не определено'
        }
        const desc = descIndList.map(index => descList[index]).join(', ')

        return `Команда характеризуется такими качествами как ${desc}`
    }

    function getNeed(maxSectorSq: number): number[] {
        const minorOctants: IOctant[] = teamPortrait.filter((item: IOctant) => item.value < maxSectorSq * .15)
        return minorOctants.map(item => item.index)
    }

    function getAllCandidates(poolMembers: IMember[], teamMembers: IMember[]) {
        const teamIdList = teamMembers.map(item => item.baseID)
        return poolMembers.filter(item => !teamIdList.includes(item.baseID))
    }

    function getCandidates(teamPortrait: IOctant[], teamSpecInd: number, allCandidates: IMember[]) {
        const specsList = [['A1', 'A2', 'B1', 'B2', 'a1', 'a2', 'b1', 'b2'], ['A1', 'A2'], ['B1', 'B2'], ['a1', 'a2'], ['b1', 'b2']]
        const majorOctants = teamPortrait.filter((item: IOctant) => item.value >= maxSectorSq * .3)
        const majorCodes   = majorOctants.map(item => item.code)

        if (!isNeeded(majorOctants, teamSpecInd, specsList)) {
            return null
        }
        if (majorOctants.length === 8) {
            return null
        }

        return allCandidates.filter(item => {

            const profile  = UserResult.getProfile(item.decData[1])
            const portrait = UserResult.getPortrait(profile)
            const sortedOctants = [...portrait].sort((a, b) => (b.value - a.value))

            if (!checkIntensity(profile, teamProfile)) {
                return false
            }
            return (
                (majorCodes.includes(sortedOctants[0].code) && specsList[teamSpecInd].includes(sortedOctants[1].code))
                ||
                (majorCodes.includes(sortedOctants[1].code) && specsList[teamSpecInd].includes(sortedOctants[0].code))
            )
        })
    }

    //не слишком ли расходится интенсивность кандидата и команды
    function checkIntensity(memberProfile: ITendency[], teamProfile: ITendency[]): boolean {
        const sortedMemberProfile = [...memberProfile].sort((a, b) => b.value - a.value)
        const sortedTeamProfile = [...teamProfile].sort((a, b) => b.value - a.value)
        return !(sortedMemberProfile[0].value > sortedTeamProfile[0].value * 1.2 || sortedMemberProfile[0].value < sortedTeamProfile[0].value * .8);
    }

    //for function getCandidate
    function isNeeded(majorOctants: IOctant[], specInd: number, specsList: string[][]): boolean{
        const majorOctantsCodes = majorOctants.map(item => item.code)

        if (majorOctantsCodes.includes(specsList[specInd][0]) && majorOctantsCodes.includes(specsList[specInd][1])) {
            const specOctants = majorOctants.filter(octant => octant.code === specsList[specInd][0] || octant.code === specsList[specInd][1])
            const maxOctant = specOctants[0].value > specOctants[1].value ? specOctants[0] : specOctants[1]

            if (Math.abs(specOctants[0].value - specOctants[1].value) < maxOctant.value * .2) {
                return false
            }
        }
        return true
    }

    function getUnwanted(members: IMember[], teamProfile: ITendency[]): IMember[] {
        return members.filter(item => !checkIntensity(UserResult.getProfile(item.decData[1]), teamProfile))
    }

    function getResultTableData() {

        let candidateData: TableRow | null = []
        if (!candidates) {
            candidateData = null
        } else if (candidates && candidates.length === 0) {
            candidateData = ['Работники, рекомендуемые в команду', 'Среди ваших работников нет подходящего кандидата']
        }
        else {
            candidateData = ['Работники, рекомендуемые в команду', candidates.map(item => item.name).join(', ')]
        }

        const unwantedData = unwanted.length === 0 ?
            null :
            ['Работники, создающие напряжение в команде', unwanted.map(item => item.name).join(', ')]

        return [
            ['Лояльность к внешнему руководству',           getDescByRange(loyalty, descriptions.loyaltyDesc)],
            ['Ответственность команды',                     getDescByRange(commitment, descriptions.commitmentDesc)],
            ['Лидер команды',                               leaderName],
            ['Альтернативный лидер',                        opinionLeaderName],
            needList.length > 0 ? ['Типы, рекомендуемые в команду', needList.map(i => scheme.psychoTypes[i]).join(', ')] : null,
            candidateData ? candidateData : null,
            unwantedData ? unwantedData : null
        ]
    }

}

export default TeamCoopResult