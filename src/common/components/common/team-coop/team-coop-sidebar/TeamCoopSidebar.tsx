import React from 'react'
import Button from "../../buttons/button/Button"
import {GlobalStateType, ITeamProfile} from "../../../../../constants/types"
import {useDispatch, useSelector} from "react-redux"
import style from './team-coop-sidebar.module.scss'
import {GoRocket} from "react-icons/go"
import {setActiveTeam, setRandomNum} from "../../../../actions/actionCreator"
import TeamModule from "./team-module/TeamModule";

const TeamCoopSidebar: React.FC = () => {

    const teams: ITeamProfile[] = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams.slice(1))
    const activeTeam: number = useSelector((state: GlobalStateType) => state.teamCoopReducer.activeTeam)
    const dispatch = useDispatch();

    return (
        <aside className={style.aside}>
            <div className={`${style.body}`}>
                {teams.map((team, i) => {
                    const isActive = i === activeTeam;
                    return (
                        <TeamModule
                            key={i}
                            team={team}
                            isActive={isActive}
                            handler={() => dispatch(setActiveTeam(i))}
                        />
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
        dispatch(setRandomNum(Math.random()))
        if(typeof window !== 'undefined' && document.getElementById('teamResult')) {
            const el = document.getElementById('teamResult')
            el && el.scrollIntoView()
            // window.scrollTo(0, 900);
        }
        // dispatch(setActiveTeam(0))
    }
}

export default TeamCoopSidebar;