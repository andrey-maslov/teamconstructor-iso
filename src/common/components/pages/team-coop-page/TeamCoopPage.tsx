import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import DraggableZone from "../../common/team-coop/DraggableZone"
import TeamCoopResult from "../../common/team-coop/team-coop-result/TeamCoopResult"
import TeamCoopSidebar from "../../common/team-coop/team-coop-sidebar/TeamCoopSidebar"
import {GlobalStateType} from "../../../../constants/types";
import CreateProject from "../../common/team-coop/create-project/CreateProject";
import BoardInfo from "../../common/team-coop/board-info/BoardInfo";
import {exitConfirmation} from "../../../../helper/helper";
import Loader from "../../common/loaders/loader/Loader";

const TeamCoopPage: React.FC = () => {

    const {isLoggedIn, projects} = useSelector((state: GlobalStateType) => state.userData)
    const {isLoading} = useSelector((state: GlobalStateType) => state.appReducer)
    const [isSidebarFull, setSidebarFull] = useState(false)
    const [isPageReady, setPageReady] = useState(false)

    // useEffect(() => {
    //     if (projects && projects.length > 0) {
    //         setPageReady(true)
    //     }
    // }, [])
    //
    // if (!isPageReady) {
    //     return <main className="section main text-center">
    //         <Loader/>
    //     </main>
    // }

    if (!isLoggedIn) {
        return <main className="flex-centered text-center">Пожалуйста, авторизируйтесь</main>
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
        <div className='section page-team'>
            <div className={`team-sidebar`}>
                <TeamCoopSidebar/>
            </div>
            <main className="">
                <div className="drag-area">
                    <BoardInfo/>
                    <DraggableZone/>
                    <TeamCoopResult/>
                </div>
            </main>
        </div>
    );
};

export default TeamCoopPage;