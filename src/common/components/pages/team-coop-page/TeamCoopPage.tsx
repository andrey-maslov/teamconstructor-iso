import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import DraggableZone from "../../common/team-coop/DraggableZone"
import TeamCoopResult from "../../common/team-coop/team-coop-result/TeamCoopResult"
import Box from "../../common/layout/box/Box"
import TeamCoopSidebar from "../../common/team-coop/team-coop-sidebar/TeamCoopSidebar"
import {GlobalStateType} from "../../../../constants/types";
import CreateProject from "../../common/team-coop/create-project/CreateProject";
import BoardInfo from "../../common/team-coop/board-info/BoardInfo";
import {exitConfirmation} from "../../../../helper/helper";
import {OpenSidebarBtn} from "../../common/buttons/open-sidebar-btn/OpenSidebarBtn";
import Loader from "../../common/loaders/loader/Loader";

const TeamCoopPage: React.FC = () => {

    const {isLoggedIn, projects}  = useSelector((state: GlobalStateType) => state.userData)
    const {isLoading}  = useSelector((state: GlobalStateType) => state.appReducer)
    const [isSidebar, setSidebar] = useState(false)

    if (isLoading) {
        return <main className="section main text-center">
            <Loader/>
        </main>
    }

    if (!isLoggedIn) {
        return <main className="section main text-center">Пожалуйста, авторизируйтесь</main>
    }

    if (!isLoading && projects.length === 0) {
        return (
            <main className="flex-centered page-team">
                <div>
                    <p style={{fontSize: '24px'}}>У вас еще нет ниодного проекта. <br/>Создайте свой первый проект</p>
                    <CreateProject/>
                </div>
            </main>
        )
    }

    // exitConfirmation()

    return (
        <main className='section page-team main'>
            <div className="container-wide">
                <BoardInfo/>
                <div className="flex-row">
                    <div className="drag-area">
                        <DraggableZone/>
                        <TeamCoopResult/>
                    </div>

                    <div className={`team-sidebar ${isSidebar ? 'visible' : ''}`}>
                        <OpenSidebarBtn handler={() => setSidebar(!isSidebar)}/>
                        <Box title={'Статус'}>
                        <TeamCoopSidebar/>
                    </Box>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TeamCoopPage;