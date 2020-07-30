import React, {useEffect, useState, useMemo} from 'react'
import {useSelector} from "react-redux"
import {DecodedDataType, GlobalStateType, IEmployeeProfile, ITeamProfile} from "../../../../../constants/types";
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

    if (!activeTeam || activeTeam.items.length  === 0) {
        return null
    }

    if (activeTeam.items.length < 2 || activeTeam.items.length > 9) {
        return <div className="" style={{textAlign: 'center'}}>Количество участников команды должно быть от 2 до 9</div>
    }

    const testResults = activeTeam.items.map((item: IEmployeeProfile, i: number) => {
        return item.decData[1]
    })

    console.log(activeTeam.items.length)
    const fullProfiles = testResults.map((item: resultType) => {
        return new UserResult(item, schemeCurrent)
    })

    const profiles = fullProfiles.map((profile: any, i: number) => ({
        name: `${activeTeam.items[i].name}`,
        data: profile.profile
    }))

    return (
        <>
            {isReady &&
            <div>
                <Box>
                    {profiles.length !== 0 && <RadarChart profiles={profiles}/>}
                </Box>
            </div>}
        </>
    );
}

export default TeamCoopResult;