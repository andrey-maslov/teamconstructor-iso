import React from 'react';
import {ITeamProfile} from "../../../../../../constants/types";

import style from './team-module.module.scss';

interface TeamModuleProps {
    team: ITeamProfile
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
            <h5 className={style.title}>{team.label}</h5>
            <div><span>Размер:</span> {team.items.length}</div>
        </div>
    );
}

export default TeamModule;