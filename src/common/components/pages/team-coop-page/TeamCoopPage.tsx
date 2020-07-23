import React from 'react'
import Loader from "../../common/loaders/loader/Loader"
import {SchemeType} from "../../../../UserResult"
import {useSelector} from "react-redux"
import DraggableZone from "../../common/team-coop/DraggableZone";

const TeamCoopPage: React.FC = () => {

    return (
        <main className='section page-team main'>
            <div className="container-wide">
                <DraggableZone/>
            </div>
        </main>
    );
};

export default TeamCoopPage;