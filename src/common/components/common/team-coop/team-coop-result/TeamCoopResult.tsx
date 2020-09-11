import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux"
import {GlobalStateType, IMember, ITeam} from "../../../../../constants/types"
import Box from "../../layout/box/Box"
import {Team, getDescByRange, getKeyResult, baseTestResultType, IDescWithStatus} from "../../../../../cooperation"
import RadarChart from "../../charts/radar-chart/RadarChart"
import KeyIndicator from "../../result-common/key-indicator/KeyIndicator"
import Description from "../../result-common/description/Description"
import {useTranslation} from "react-i18next"
import PolarChart from "../../charts/polar-chart/PolarChart"

const TeamCoopResult: React.FC = () => {

    const {terms: scheme, descriptions} = useSelector((state: GlobalStateType) => state.termsReducer)
    const teamCoop                      = useSelector((state: GlobalStateType) => state.teamCoopReducer)
    const activeTeamInd: number         = teamCoop.activeTeam
    const randomNum: number             = teamCoop.randomNum
    const activeTeam: ITeam             = teamCoop.teams[activeTeamInd + 1]
    const teamsCount                    = teamCoop.teams.length

    //if all resources are fetched, calculated and ready to display
    const [isReady, setReady] = useState(false)
    const {t} = useTranslation()

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

    const teamSpec: number       = teamCoop.teamSpec
    const poolMembers: IMember[] = teamCoop.teams[0].items
    const teamMembers: IMember[] = activeTeam.items

    if (activeTeam.items.length < 3 || activeTeam.items.length > 9) {
        return <div className="" style={{textAlign: 'center'}}>{t('team:members_limit')}</div>
    }

    const testResultList: baseTestResultType[] = activeTeam.items.map((item: IMember) => {
        return item.decData[1]
    })

    const team = new Team(testResultList)

    const names             = activeTeam.items.map((item: IMember) => item.name)

    const crossFunc     = team.getCrossFunc()
    const interaction   = team.getInteraction()
    const emotionalComp = team.getEmotionalComp()
    const loyalty       = team.getLoyalty()
    const leaderName    = names[team.getLeadingMemberByType(1)]
    const altLeaderName = names[team.getLeadingMemberByType(2)]
    const commitment    = team.getCommitment()
    const descIndexes   = team.getDescIndexes()
    const teamDesc      = getTeamDesc(descIndexes, descriptions.complementarityDesc.variants)

    const fullDescription   = getResultTableData()

    const keyValues  = [crossFunc, emotionalComp, interaction].map((value, i) => ({
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
                                teamProfile={{title: descriptions.complementarityDesc.title, desc: teamDesc.desc, status: teamDesc.status}}
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
        const allCandidates = Team.getAllCandidates(poolMembers, teamMembers)
        const candidates = team.getCandidates(teamSpec, allCandidates)
        const {title, variants} = descriptions.candidatesDesc
        if (teamMembers.length < 4 && teamSpec === 0) {
            return {title, desc: t('team:not_enough_members_for_universal'), status: -1}
        }
        if (!candidates) {
            return {title, desc: variants[1], status: 2}
        }
        if (candidates && candidates.length === 0) {
            return {title, desc: variants[0], status: 0}
        }
        return {title, desc: candidates.map(item => item.name).join(', '), status: 1}
    }


    function getNeedfulData() {
        const NeedfulList = team.getNeedfulPsychoType()
        const {title, variants} = descriptions.needDesc
        if (NeedfulList.length === 0) {
            return {title, desc: variants[1], status: 2}
        }
        return {title, desc: NeedfulList.map(i => scheme.psychoTypes[i]).join(', '), status: 1}
    }


    function getUnwontedData() {
        const unwanted = team.getUnwanted(teamMembers)
        const {title, variants} = descriptions.unwantedDesc
        if (unwanted.length === 0) {
            return {title, desc: variants[0], status: 2}
        }
        if (unwanted.length > 2) {
            return {title, desc: `${unwanted.map(item => item.name).join(', ')} ( ${variants[1]} )`, status: 0}
        }
         return {title, desc: unwanted.map(item => item.name).join(', '), status: 1}
    }


    function getResultTableData() {

        return [
            getDescByRange(loyalty, descriptions.loyaltyDesc),
            getDescByRange(commitment, descriptions.commitmentDesc),
            {title: descriptions.leaderDesc.variants[0], desc: leaderName, status: 2},
            {title: descriptions.leaderDesc.variants[1], desc: altLeaderName, status: altLeaderName !== leaderName ? 2 : 1},
            getNeedfulData(),
            getCandidatesData(),
            getUnwontedData()
        ]
    }

    /**
     *
     */
    function getTeamDesc(descIndexes: number[], descList: string[]): {desc: string, status: number} {
        if (descIndexes.length === 0) {
            return {desc: descList[8], status: -1}
        }
        const description = descIndexes.map(index => descList[index]).join(', ')
        return {desc: t('team:team_is_characterized', {description}), status: 2}
    }
}

export default TeamCoopResult