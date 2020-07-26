import React from 'react'
import Button from "../../buttons/button/Button"
import {GlobalStateType, ITeamProfile} from "../../../../../constants/types"
import {useDispatch, useSelector} from "react-redux"
import style from './team-coop-sidebar.module.scss'
import {GoRocket} from "react-icons/go"
import {setActiveTeam, setTeamsData} from "../../../../actions/actionCreator"

const TeamCoopSidebar: React.FC = () => {

    const teams: ITeamProfile[] = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams.slice(1))
    const dispatch = useDispatch();


    return (
        <aside className={style.aside}>
            <div className={`${style.body}`}>
                {teams.map((team) => {
                    return (
                        <div key={team.label} className={`${style.block}`}>
                            <h5>{team.label}</h5>
                            <div><span>Members</span>: {team.items.length}</div>
                        </div>
                    )
                })}
            </div>
            <div className={`${style.bottom}`}>
                <Button
                    title={'Просчитать'}
                    handle={calculateHandler}
                    btnClass={'btn btn-accent'}
                    startIcon={<GoRocket/>}
                />
            </div>
        </aside>
    );

    function calculateHandler() {
        // dispatch(setTeamsData(teams))
        dispatch(setActiveTeam(0))
    }
}

export default TeamCoopSidebar;