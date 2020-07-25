import React from 'react'
import Button from "../../buttons/button/Button"
import {ITeamProfile} from "../../../../../constants/types"
import {useDispatch} from "react-redux"
import style from './team-coop-sidebar.module.scss'
import {GoRocket} from "react-icons/go"
import {setActiveTeam, setTeamsData} from "../../../../actions/actionCreator"

interface ITeamCoopSidebar {
    teams: ITeamProfile[]
}

const TeamCoopSidebar: React.FC<ITeamCoopSidebar> = ({teams}) => {

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
        dispatch(setTeamsData(teams))
        dispatch(setActiveTeam(0))
    }
}

export default TeamCoopSidebar;