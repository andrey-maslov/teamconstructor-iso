import React from 'react'
import {useSelector} from "react-redux"
import {DecodedDataType, GlobalStateType, IEmployeeProfile, ITeamProfile} from "../../../../../constants/types";
import Box from "../../layout/box/Box";
import {SchemeType, UserResult, resultType} from "../../../../../UserResult";

const TeamCoopResult: React.FC = () => {

    const teams: ITeamProfile[] = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    const schemeCurrent: SchemeType = useSelector((state: GlobalStateType) => state.termsReducer.terms)

    if (teams.length === 0 && !schemeCurrent) {
        console.log(teams.length)
        return null
    }

    console.log(schemeCurrent)

    const testResults = teams[0].items.map((item: IEmployeeProfile, i: number) => {
        return item.decData[1]
    })

    // const profiles = testResults.map((item: resultType) => {
    //     return new UserResult(item, schemeCurrent)
    // })

    try {
        const fullProfile1 = new UserResult(testResults[1], schemeCurrent)
    }
    catch (e) {
        console.log(e)
    }

    // console.log(fullProfile1)


    return (
        <div>
           <Box>
               {/*<RadarChart profiles={}/>*/}
           </Box>
        </div>
    );
}

export default TeamCoopResult;