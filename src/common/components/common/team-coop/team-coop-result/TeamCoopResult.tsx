import React, {useEffect, useState, useMemo} from 'react'
import {useSelector} from "react-redux"
import {GlobalStateType, IEmployeeProfile, ITeamProfile} from "../../../../../constants/types";
import Box from "../../layout/box/Box";
import {SchemeType, UserResult, resultType} from "../../../../../UserResult";
import RadarChart from "../../charts/radar-chart/RadarChart";

const TeamCoopResult: React.FC = () => {

    const activeTeamInd: number = useSelector((state: GlobalStateType) => state.teamCoopReducer.activeTeam)
    const randomNum: number = useSelector((state: GlobalStateType) => state.teamCoopReducer.randomNum)
    const activeTeam: ITeamProfile = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams[activeTeamInd + 1])
    const schemeCurrent: SchemeType = useSelector((state: GlobalStateType) => state.termsReducer.terms)

    const [isReady, setReady] = useState(false)

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

    const testResults = activeTeam.items.map((item: IEmployeeProfile, i: number) => {
        return item.decData[1]
    })

    const fullProfiles = testResults.map((item: resultType) => {
        return new UserResult(item, schemeCurrent)
    })

    const profiles = fullProfiles.map((profile: any, i: number) => ({
        name: `${activeTeam.items[i].name}`,
        data: profile.profile
    }))

    const teamProfile = getTeamProfile(profiles)

    console.log(teamProfile)

    return (
        <>
            {isReady &&
            <div className={'result-wrapper'}>

                <div className={'result-area flex-row'}>
                    <Box
                        addClass="team-radar"
                        title={`${activeTeam.label}. Профили участников`}
                    >
                        {profiles.length !== 0 && <RadarChart profiles={profiles}/>}
                    </Box>
                    <Box
                        addClass="team-keys"
                        title={`${activeTeam.label}. Ключевые показатели`}
                    >
                        key values
                    </Box>
                </div>

                <div className={'result-area flex-row'}>
                    <Box
                        addClass="team-radar"
                        title={`${activeTeam.label}. Общий профиль`}
                    >
                        {profiles.length !== 0 && <RadarChart profiles={[{name: 'common', data: teamProfile}]}/>}
                    </Box>
                    <Box
                        addClass="team-keys"
                        title={`${activeTeam.label}. Советы и рекоменации`}
                    >
                        Советы
                    </Box>
                </div>
            </div>
            }
        </>
    );

    function getTeamProfile(profiles: { name: string, data: [string, number][] }[]) {
        const arrSum: any = [[], [], [], [], [], [], [], []];
        const count = profiles.length;

        for (let i = 0; i < count; i++) {
            for (let k = 0; k < 8; k++) {
                arrSum[k].push(profiles[i].data[k][1])
            }
        }

        return arrSum.map((item: number[], i: number) => {
            const sum = item.reduce((a, b) => a + b)
            return [profiles[0].data[i][0], Number((sum / count).toFixed(1))]
        })
    }
}

export default TeamCoopResult;