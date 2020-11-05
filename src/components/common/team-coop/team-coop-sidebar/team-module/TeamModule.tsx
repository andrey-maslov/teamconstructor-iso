import React from 'react'
import {FaUserAlt} from 'react-icons/fa'
import {ITeam} from "../../../../../constants/types"

import style from './team-module.module.scss'

interface TeamModuleProps {
    team: ITeam
    index: number
    isActive: boolean
    handler: () => void
    isCompact?: boolean
}

const TeamModule: React.FC<TeamModuleProps> = ({team, index, isActive, handler, isCompact}) => {

    return (
        <div
            tabIndex={0}
            role={'button'}
            className={`${style.block} ${isActive ? style.active : ''} ${isCompact ? style.compact : ''}`}
            onClick={handler}
            onKeyPress={handler}
        >
            {!isCompact ? (
                    <>
                        <div className={style.title}>{team.title}</div>
                        <div className={style.count}>
                            <FaUserAlt/>
                            <span>{`x `}{team.items.length}</span>
                        </div>
                    </>
                )
                :
                <div>{index + 1}</div>}
        </div>
    );
}

export default TeamModule;