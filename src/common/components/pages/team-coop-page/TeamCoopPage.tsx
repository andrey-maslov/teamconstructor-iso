import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Loader from "../../common/loaders/loader/Loader"
import DraggableZone from "../../common/team-coop/DraggableZone"
import TeamCoopResult from "../../common/team-coop/team-coop-result/TeamCoopResult"
import Box from "../../common/layout/box/Box"
import TeamCoopSidebar from "../../common/team-coop/team-coop-sidebar/TeamCoopSidebar"
// import {} from '../../../actions/actionCreator'
import {GlobalStateType} from "../../../../constants/types";

const TeamCoopPage: React.FC = () => {

    const dispatch = useDispatch()
    const userData = useSelector((state: GlobalStateType) => state.userData)
    const {isLoggedIn, id} = userData

    // useEffect(() => {
    //     if(userData.isLoggedIn && userData.id) {
    //         dispatch(fetchTeams(userData.id, userData.token))
    //     }
    // }, [userData.isLoggedIn, userData.id])

    if (!isLoggedIn) {
        return <main className="section main text-center">Пожалуйста, авторизируйтесь</main>
    }

    return (
        <main className='section page-team main'>
            <div className="container-wide">
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