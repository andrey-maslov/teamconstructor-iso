import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {GlobalStateType, IMember, ITeam, TableRow} from "../../../../../constants/types"
import Box from "../../layout/box/Box"
import {UserResult, baseTestResultType, IUserResult, ITendency, IOctant} from "../../../../../UserResult"
import RadarChart from "../../charts/radar-chart/RadarChart"
import KeyIndicator from "../../result-common/key-indicator/KeyIndicator"
import {getDescByRange, getKeyResult} from "../../../../../helper/helper"
import Description from "../../result-common/description/Description";

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
    const teamProfileDesc   = getProfileDesc(maxSectorSq, descriptions.complementarityDesc.variants)
    const needList          = getNeed(maxSectorSq)
    const candidates        = getCandidates(teamPortrait, teamSpec, allCandidates)
    const unwanted          = getUnwanted(teamMembers, teamProfile)

    const keyValues  = [crossFunc, emotionalComp, interaction].map((value, i) => ({
        title: descriptions.keyIndicators[i].title,
        description: getKeyResult(value, ['', 'хороший результат', 'отличный результат']),
        more: descriptions.keyIndicators[i].desc,
        value
    }))

    const teamDescriptionData = getResultTableData()

    return (
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
                            <div className="row">
                                {keyValues.map((item, i) => (
                                    <div key={i} className={'col-sm-4'}>
                                        <KeyIndicator
                                            title={item.title}
                                            description={item.description}
                                            value={item.value}
                                            more={item.more}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Box>


                        <Box
                            addClass="team-table team-indicators"
                            title={`${activeTeam.title}. Показатели`}
                        >
                            <Description
                                teamProfile={{title: `${descriptions.complementarityDesc.title}`, desc: teamProfileDesc, status: 1}}
                                data={teamDescriptionData}
                            />
                        </Box>
                    </div>
                </div>
            </div>
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

    function getTeamMaxIntensity(profiles: ITendency[][]): number {
        const maxValues = profiles.map(profile => {
            const sorted = [...profile].sort((a, b) => b.value - a.value)
            return sorted[0].value
        })
        return maxValues.reduce((a,b) => a + b) / profiles.length
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
            return descList[8]
        }
        const desc = descIndList.map(index => descList[index]).join(', ')

        return `Команда характеризуется такими качествами как ${desc}`
    }

    function getNeed(maxSectorSq: number): number[] {
        const minorOctants: IOctant[] = teamPortrait.filter((item: IOctant) => item.value < maxSectorSq * .3)
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

            if (!checkIntensity(profile)) {
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
    function checkIntensity(memberProfile: ITendency[]): boolean {
        const teamMaxIntensity  = getTeamMaxIntensity(profiles)
        const sortedMemberProfile = [...memberProfile].sort((a, b) => b.value - a.value)
        return !(sortedMemberProfile[0].value > teamMaxIntensity * 1.3 || sortedMemberProfile[0].value < teamMaxIntensity * .7);
    }

    //for function getCandidate
    function isNeeded(majorOctants: IOctant[], specInd: number, specsList: string[][]): boolean{
        const majorOctantsCodes = majorOctants.map(item => item.code)

        if (majorOctantsCodes.includes(specsList[specInd][0]) && majorOctantsCodes.includes(specsList[specInd][1])) {
            const specOctants = majorOctants.filter(octant => octant.code === specsList[specInd][0] || octant.code === specsList[specInd][1])
            const maxOctant = specOctants[0].value > specOctants[1].value ? specOctants[0] : specOctants[1]

            if (Math.abs(specOctants[0].value - specOctants[1].value) < maxOctant.value * .3) {
                return false
            }
        }
        return true
    }

    function getUnwanted(members: IMember[], teamProfile: ITendency[]): IMember[] {
        return members.filter(item => !checkIntensity(UserResult.getProfile(item.decData[1])))
    }

    function getResultTableData() {

        let candidateData: { title: string; desc: string; status: number }
        if (!candidates) {
            candidateData = {title: descriptions.candidatesDesc.title, desc: descriptions.candidatesDesc.variants[1], status: 2}
        } else if (candidates.length === 0) {
            candidateData = {title: descriptions.candidatesDesc.title, desc: descriptions.candidatesDesc.variants[0], status: 0}
        }
        else {
            candidateData = {title: descriptions.candidatesDesc.title, desc: candidates.map(item => item.name).join(', '), status: 1}
        }

        let unwantedData: { title: string; desc: string; status: number }
        if (unwanted.length === 0) {
            unwantedData = {title: descriptions.unwantedDesc.title, desc: descriptions.candidatesDesc.variants[1], status: 2}
        } else if (unwanted.length > 1) {
           unwantedData = {title: descriptions.unwantedDesc.title, desc: `${unwanted.map(item => item.name).join(', ')} ${descriptions.candidatesDesc.variants[1]}`, status: 0}
        } else {
           unwantedData = {title: descriptions.unwantedDesc.title, desc: unwanted.map(item => item.name).join(', '), status: 1}
        }

        let needData: { title: string; desc: string; status: number }
        if (needList.length === 0) {
            needData = {title: descriptions.needDesc.title, desc: descriptions.needDesc.variants[1], status: 2}
        }
        else {
            needData = {title: descriptions.needDesc.title, desc: needList.map(i => scheme.psychoTypes[i]).join(', '), status: 1}
        }



        return [
            getDescByRange(loyalty, descriptions.loyaltyDesc),
            getDescByRange(commitment, descriptions.commitmentDesc),
            {title: 'Лидер команды', desc: leaderName, status: 2},
            {title: 'Альтернативный лидер', desc: opinionLeaderName, status: opinionLeaderName !== leaderName ? 2 : 1},
            needData,
            candidateData,
            unwantedData
        ]
    }

}

export default TeamCoopResult