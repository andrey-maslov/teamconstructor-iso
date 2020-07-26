import React, {useEffect, useState, useMemo} from 'react'
import {useSelector} from "react-redux"
import {DecodedDataType, GlobalStateType, IEmployeeProfile, ITeamProfile} from "../../../../../constants/types";
import Box from "../../layout/box/Box";
import {SchemeType, UserResult, resultType} from "../../../../../UserResult";
import RadarChart from "../../charts/radar-chart/RadarChart";

const TeamCoopResult: React.FC = () => {

    const teams: ITeamProfile[] = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams.slice(1))
    const schemeCurrent: SchemeType = useSelector((state: GlobalStateType) => state.termsReducer.terms)

    console.log('from result')

    if (teams.length === 0) {
        return null
    }
    if (!schemeCurrent) {
        return null
    }

    const testResults = teams[0].items.map((item: IEmployeeProfile, i: number) => {
        return item.decData[1]
    })

    const fullProfiles = testResults.map((item: resultType) => {
        return new UserResult(item, schemeCurrent)
    })

    const profiles = fullProfiles.map((profile: any, i: number) => ({name: `${teams[0].items[i].name}`, data: profile.profile}))

    return (
        <div>
            <Box>
                {profiles.length !== 0 && <RadarChart profiles={profiles}/>}
            </Box>
        </div>
    );
}

export default TeamCoopResult;