import React, { useState, useEffect } from 'react'
import Button from "../../buttons/button/Button"
import { globalStoreType, ITeam } from "../../../../../constants/types"
import { useDispatch, useSelector } from "react-redux"
import style from './team-coop-sidebar.module.scss'
import { GoRocket } from "react-icons/go"
import TeamModule from "./team-module/TeamModule"
import TeamSpec from "./team-spec/TeamSpec"
import { SET_ACTIVE_TEAM, SET_RANDOM, SET_TEAM_SPEC } from "../../../../actions/actionTypes"
import { useMediaPredicate } from 'react-media-hook'
import { OpenSidebarBtn } from "../../buttons/open-sidebar-btn/OpenSidebarBtn"
import { useTranslation } from "react-i18next"

const TeamCoopSidebar: React.FC = () => {

    const teamsState = useSelector((state: globalStoreType) => state.team)
    const teams: ITeam[] = teamsState.teams ? teamsState.teams.slice(1) : []
    const activeTeam: number = teamsState.activeTeam
    const teamSpec: number = teamsState.teamSpec
    const dispatch = useDispatch()
    const isMedium = useMediaPredicate('(max-width: 1400px)')
    const [isCompact, setCompact] = useState(false)
    const { t } = useTranslation()
    const mediumClasses = isCompact ? 'compact' : 'full'

    useEffect(() => {
        isMedium ? setCompact(true) : setCompact(false)
    }, [isMedium, teams])

    return (
        <aside className={`${style.aside} ${isMedium ? style[mediumClasses] : ''}`}>
            {isMedium &&
            <
                OpenSidebarBtn
                handler={() => setCompact(!isCompact)}
                isCompact={isCompact}
            />}
            <div className={`${style.body}`}>
                <TeamSpec
                    teamSpec={teamSpec}
                    changeSpec={changeSpec}
                    isCompact={isCompact}
                />
                {teams.map((team, i) => {
                    const isActive = i === activeTeam;
                    return (
                        <TeamModule
                            key={i}
                            index={i}
                            team={team}
                            isActive={isActive}
                            handler={() => dispatch({ type: SET_ACTIVE_TEAM, activeTeam: i })}
                            isCompact={isCompact}
                        />
                    )
                })}
            </div>
            <div className={`${style.bottom}`}>
                <Button
                    title={!isCompact ? t('common:buttons.calculate') : ''}
                    handle={calculateHandler}
                    btnClass={'btn btn-accent'}
                    startIcon={<GoRocket />}
                />
            </div>
        </aside>
    );

    function calculateHandler() {
        dispatch({ type: SET_RANDOM, randomNum: Math.random() })
        if (typeof window !== 'undefined' && document.getElementById('teamResult')) {
            const el = document.getElementById('teamResult')
            el && el.scrollIntoView()
            // window.scrollTo(0, 900);
        }
    }

    function changeSpec(index: number): void {
        dispatch({ type: SET_TEAM_SPEC, teamSpec: index })
    }
}

export default TeamCoopSidebar;