import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import DraggableZone from "../../common/team-coop/DraggableZone"
import TeamCoopResult from "../../common/team-coop/team-coop-result/TeamCoopResult"
import Box from "../../common/layout/box/Box"
import TeamCoopSidebar from "../../common/team-coop/team-coop-sidebar/TeamCoopSidebar"
import {GlobalStateType} from "../../../../constants/types";
import CreateProject from "../../common/team-coop/create-project/CreateProject";
import BoardInfo from "../../common/team-coop/board-info/BoardInfo";
import {exitConfirmation} from "../../../../helper/helper";
import {fetchProject} from "../../../actions/actionCreator";
import style from "../../common/team-coop/create-project/create-project.module.scss";

const TeamCoopPage: React.FC = () => {

    const dispatch = useDispatch()
    const userData = useSelector((state: GlobalStateType) => state.userData)
    const {isLoggedIn, id} = userData

    const {projects} = userData

    useEffect(() => {
        // if(userData.isLoggedIn && userData.id) {
        //     dispatch(fetchProject(userData.activeProject.id, userData.token))
        // }
    }, [userData.isLoggedIn, userData.id])

    if (!isLoggedIn) {
        return <main className="section main text-center">Пожалуйста, авторизируйтесь</main>
    }

    if (projects.length === 0) {
        return (
            <main className="flex-centered page-team">
                <div>
                    <p style={{fontSize: '24px'}}>У вас еще нет ниодного проекта. <br/>Создайте свой первый проект</p>
                    <CreateProject/>
                </div>
            </main>
        )
    }

    exitConfirmation()

    return (
        <main className='section page-team main'>
            <div className="container-wide">
                <BoardInfo/>
                <div className="flex-row">
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