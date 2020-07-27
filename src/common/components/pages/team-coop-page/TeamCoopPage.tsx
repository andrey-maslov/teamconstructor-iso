import React from 'react'
import Loader from "../../common/loaders/loader/Loader"
import DraggableZone from "../../common/team-coop/DraggableZone";
import TeamCoopResult from "../../common/team-coop/team-coop-result/TeamCoopResult";
import Box from "../../common/layout/box/Box";
import TeamCoopSidebar from "../../common/team-coop/team-coop-sidebar/TeamCoopSidebar";

const TeamCoopPage: React.FC = () => {

    return (
        <main className='section page-team main'>
            <div className="container-wide">
                <div className="row">
                    <div className="drag-area">
                        <DraggableZone/>
                        <TeamCoopResult/>
                    </div>

                    <Box title={'Статус'} addClass={'team-sidebar'}>
                        <TeamCoopSidebar/>
                    </Box>
                </div>
            </div>
        </main>
    );
};

export default TeamCoopPage;