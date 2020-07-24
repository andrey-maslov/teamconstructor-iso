import React from 'react';
import {ITeamProfile} from "../../../../../constants/types";

interface ITeamCoopSidebar {
    teams: ITeamProfile[]
}

const TeamCoopSidebar: React.FC<ITeamCoopSidebar> = ({teams}) => {

    return (
        <aside>
            {teams.map((team) => {
                return (
                    <>
                        <h5>{team.label}</h5>
                        <div><span>Members</span>: {team.items.length}</div>
                    </>
                )
            })}
        </aside>
    );
}

export default TeamCoopSidebar;