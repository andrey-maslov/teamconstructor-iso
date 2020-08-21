import React from 'react';
import {ITeam} from "../../../../../../constants/types";

import style from './team-module.module.scss';

interface TeamModuleProps {
    team: ITeam
    isActive: boolean
    handler: () => void
}

const TeamModule: React.FC<TeamModuleProps> = ({team, isActive, handler}) => {

    return (
        <div
            tabIndex={0}
            role={'button'}
            className={`${style.block} ${isActive ? style.active : ''}`}
            onClick={handler}
            onKeyPress={handler}
        >
            <div className={style.title}>{team.title}</div>
            <div><span>Размер:</span> {team.items.length}</div>
        </div>
    );
}

export default TeamModule;