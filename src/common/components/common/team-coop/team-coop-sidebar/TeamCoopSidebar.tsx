import React from 'react'
import Button from "../../buttons/button/Button"
import {GlobalStateType, ITeam} from "../../../../../constants/types"
import {useDispatch, useSelector} from "react-redux"
import style from './team-coop-sidebar.module.scss'
import {GoRocket} from "react-icons/go"
import {setActiveTeam, setRandomNum} from "../../../../actions/actionCreator"
import TeamModule from "./team-module/TeamModule";
import TeamSpec from "./team-spec/TeamSpec";
import {SET_TEAM_SPEC} from "../../../../actions/actionTypes";

const TeamCoopSidebar: React.FC = () => {

    const teamsState = useSelector((state: GlobalStateType) => state.teamCoopReducer)
    const teams: ITeam[] = teamsState.teams.slice(1)
    const activeTeam: number = teamsState.activeTeam
    const teamSpec: number = teamsState.teamSpec
    const dispatch = useDispatch();

    return (
        <aside className={style.aside}>
            <div className={`${style.body}`}>
                <TeamSpec teamSpec={teamSpec} changeSpec={changeSpec}/>
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

    function changeSpec(index: number): void {
        dispatch({type: SET_TEAM_SPEC, teamSpec: index})
    }
}

export default TeamCoopSidebar;