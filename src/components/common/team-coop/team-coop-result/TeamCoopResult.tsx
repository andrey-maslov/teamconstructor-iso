import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { globalStoreType, IMember, ITeam } from "../../../../constants/types"
import Box from "../../layout/box/Box"
import { Team, getDescByRange, getKeyResult } from "psychology"
import { baseTestResultType, IDescWithStatus, IOctant } from 'psychology/build/main/types/types'
import RadarChart from "../../charts/radar-chart/RadarChart"
import KeyIndicator from "../../result-common/key-indicator/KeyIndicator"
import Description from "../../result-common/description/Description"
import { useTranslation } from "react-i18next"
import PolarChart from "../../charts/polar-chart/PolarChart"
import { TEAM_LENGTH_NORMAL } from "../../../../constants/constants";

const TeamCoopResult: React.FC = () => {

    const { terms: scheme, descriptions } = useSelector((state: globalStoreType) => state.terms)

    const {
        activeTeam: activeTeamInd,
        randomNum,
        activeProject: { teams },
        teamSpec
    } = useSelector((state: globalStoreType) => state.team)

    const activeTeam: ITeam = teams[activeTeamInd + 1]
    const teamsCount = teams.length - 1

    //if all resources are fetched, calculated and ready to display
    const [isReady, setReady] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        if (activeTeam && scheme && descriptions) {
            setReady(true)
        } else if (!teams || !scheme) {
            setReady(false)
        }
    }, [randomNum, scheme, activeTeamInd, teamsCount, activeTeam])


    if (!isReady || teamsCount === 0) {
        return null
    }

    if (!activeTeam) {
        return null
    }

    if (activeTeam.items.length < TEAM_LENGTH_NORMAL[0] || activeTeam.items.length > TEAM_LENGTH_NORMAL[1]) {
        return <div className="color-yellow"
                    style={{ textAlign: 'center', padding: '2rem' }}>{t('team:members_limit')}</div>
    }

    const testResultList: baseTestResultType[] = activeTeam.items.map((item: IMember) => {
        return item.decData[1]
    })
    const poolMembers: IMember[] = teams[0].items || []
    const teamMembers: IMember[] = activeTeam.items || []

    const team = Team(testResultList)

    const names = activeTeam.items.map((item: IMember) => item.name)

    const crossFunc = team.getCrossFunc()
    const interaction = team.getInteraction()
    const emotionalComp = team.getEmotionalComp()
    const loyalty = team.getLoyalty()
    const leaderName = names[team.getLeadingMemberByType(1)]
    const altLeaderName = names[team.getLeadingMemberByType(2)]
    const commitment = team.getCommitment()
    const descIndexes = team.getDescIndexes()
    const teamDesc = getTeamDesc(descIndexes, descriptions.complementarityDesc.options)

    // team specialization description
    const specDescItems: string[] = t('team:spec_desc_items', { returnObjects: true })
    const teamSpecInd = getTeamSpec(team.portrait)
    const specDescription = getTeamSpecDescription(teamSpecInd, specDescItems, t('team:spec_desc_title'), t('common:and'))

    const fullDescription = getResultTableData()

    const keyValues = [crossFunc, emotionalComp, interaction].map((value, i) => ({
        title: descriptions.keyIndicators[i].title,
        description: getKeyResult(value, [t('team:result.defective'), t('team:result.normal'), t('team:result.good'), t('team:result.excellent')]),
        more: descriptions.keyIndicators[i].desc,
        value
    }))

    return (
        <div className={'result-wrapper'} id="teamResult">
            <div className={'result-area flex-row'}>
                <div className="col">
                    <Box
                        addClass="team-radar"
                        title={`${activeTeam.title}. ${t('team:profiles')}`}
                    >
                        {team.profileList.length !== 0 &&
                        <RadarChart
                            profiles={team.profileList}
                            names={names}
                            labels={scheme.tendencies}
                        />}
                    </Box>

                    <Box
                        addClass="team-radar"
                        title={`${activeTeam.title}. ${t('team:common_profile')}`}
                    >
                        {team.profile &&
                        <RadarChart
                            profiles={[team.profile]}
                            names={[activeTeam.title]}
                            labels={scheme.tendencies}
                        />}
                    </Box>

                    <Box
                        addClass="team-radar"
                        title={`${activeTeam.title}. Психологический портрет`}
                    >
                        {team.portrait &&
                        <PolarChart
                            portrait={convertPortraitForChart(team.portrait.map(item => item.value))}
                            labels={convertPortraitForChart(scheme.psychoTypes)}
                            description={specDescription}
                        />}
                    </Box>
                </div>

                <div className="col">
                    <Box
                        addClass="team-keys"
                        title={`${activeTeam.title}. ${t('team:key_indicators')}`}
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
                        title={`${activeTeam.title}.  ${t('team:indicators')}`}
                    >
                        <Description
                            teamProfile={{
                                title: descriptions.complementarityDesc.title,
                                desc: teamDesc.desc,
                                status: teamDesc.status
                            }}
                            data={fullDescription}
                        />
                    </Box>
                </div>
            </div>
        </div>
    );


    function convertPortraitForChart(list: any[]): any[] {
        const reversed = [...list].reverse()
        return [...reversed.slice(4), ...reversed.slice(0, 4)];
    }

    function getCandidatesData(): IDescWithStatus {
        const allCandidates = team.getAllCandidates(poolMembers, teamMembers)
        const candidates = team.getCandidates(teamSpec, allCandidates)
        const { title, options } = descriptions.candidatesDesc
        if (teamMembers.length < 4 && teamSpec === 0) {
            return { title, desc: t('team:not_enough_members_for_universal'), status: -1 }
        }
        if (!candidates) {
            return { title, desc: options[1], status: 2 }
        }
        if (candidates && candidates.length === 0) {
            return { title, desc: options[0], status: 0 }
        }
        return { title, desc: candidates.map(item => item.name).join(', '), status: 1 }
    }


    function getNeedfulData() {
        const NeedfulList = team.getNeedfulPsychoType()
        const { title, options } = descriptions.needDesc
        if (NeedfulList.length === 0) {
            return { title, desc: options[1], status: 2 }
        }
        return { title, desc: NeedfulList.map(i => scheme.psychoTypes[i]).join(', '), status: 1 }
    }


    function getUnwontedData() {
        const unwanted = team.getUnwanted(teamMembers)
        const { title, options } = descriptions.unwantedDesc
        if (unwanted.length === 0) {
            return { title, desc: options[0], status: 2 }
        }
        if (unwanted.length > 2) {
            return { title, desc: `${unwanted.map(item => item.name).join(', ')} ( ${options[1]} )`, status: 0 }
        }
        return { title, desc: unwanted.map(item => item.name).join(', '), status: 1 }
    }


    function getResultTableData() {

        return [
            getDescByRange(loyalty, descriptions.loyaltyDesc),
            getDescByRange(commitment, descriptions.commitmentDesc),
            { title: descriptions.leaderDesc.options[0], desc: leaderName, status: 2 },
            {
                title: descriptions.leaderDesc.options[1],
                desc: altLeaderName,
                status: altLeaderName !== leaderName ? 2 : 1
            },
            getNeedfulData(),
            getCandidatesData(),
            getUnwontedData()
        ]
    }

    /**
     * Get team description
     * @param descIndexes
     * @param descList
     */
    function getTeamDesc(descIndexes: readonly number[], descList: string[]): { desc: string, status: number } {
        if (descIndexes.length === 0) {
            return { desc: descList[8], status: -1 }
        }
        const description = descIndexes.map(index => descList[index]).join(', ')
        return { desc: t('team:team_is_characterized', { description }), status: 2 }
    }

    /**
     * get team specialization indexes
     */
    function getTeamSpec(portrait: readonly IOctant[]): number[] {
        const diff = .3
        const segmentsCodes = ['A', 'B', 'a', 'b']
        const segmentsValues: IOctant[] = []

        // get max value in every segment
        for (let i = 0; i < 7; i += 2) {
            segmentsValues.push(portrait[i].value >= portrait[i + 1].value ? portrait[i] : portrait[i + 1])
        }

        const sortedSegments: IOctant[] = [...segmentsValues].sort((a, b) => (b.value - a.value));
        const leadSegment = sortedSegments[0]

        // get octants from another segments which has value as large as the lead segment ( >= .7 * lead)
        const specIndexes: number[] = []
        sortedSegments.forEach(({ value, code }) => {
            if ((value > leadSegment.value * (1 - diff))) {
                specIndexes.push(segmentsCodes.indexOf(code[0]))
            }
            return
        })
        return specIndexes
    }

    /**
     * get team specialization description by spec indexes
     */
    function getTeamSpecDescription(indexes: number[], specWords: string[], phraseStart: string, unionWord: string): string {
        if (!indexes || indexes.length === 0 || !specWords || specWords.length < 4) {
            return ''
        }

        switch (indexes.length) {
            case 1:
                return `${phraseStart} ${specWords[indexes[0]]}`
            case 2:
                return `${phraseStart} ${specWords[indexes[0]]} ${unionWord} ${specWords[indexes[1]]}`
            case 3:
                return `${phraseStart} ${specWords[indexes[0]]}, ${specWords[indexes[1]]} ${unionWord} ${specWords[indexes[2]]}`
            case 4:
                return specWords[4];
            default:
                return ''
        }
    }

}

export default TeamCoopResult
