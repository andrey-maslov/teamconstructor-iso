import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import DraggableZone from '../../common/team-coop/DraggableZone'
import TeamCoopResult from '../../common/team-coop/team-coop-result/TeamCoopResult'
import TeamCoopSidebar from '../../common/team-coop/team-coop-sidebar/TeamCoopSidebar'
import { globalStoreType } from '../../../../constants/types'
import CreateProject from '../../common/team-coop/create-project/CreateProject'
import BoardInfo from '../../common/team-coop/board-info/BoardInfo'
import { useTranslation } from 'react-i18next'
import { OpenSidebarBtn } from "../../common/buttons/open-sidebar-btn/OpenSidebarBtn";
import { useMediaPredicate } from "react-media-hook";
import { isBrowser } from "../../../../helper/helper";

const TeamCoopPage: React.FC = () => {

    const { t } = useTranslation()
<<<<<<< HEAD
    // const [isCompact, setCompact] = useState(false)
=======
    const isMedium = useMediaPredicate('(max-width: 1400px)')
    const [isCompact, setCompact] = useState(isMedium)
>>>>>>> 9bf3a8a344c85fd949c3d314d367b833b5a2f513
    const { isLoggedIn, projects, activeProject } = useSelector((state: globalStoreType) => state.user)
    const { isLoading } = useSelector((state: globalStoreType) => state.app)
    // const sidebarType = isCompact ? 'compact' : 'full'


    if (!isLoggedIn) {
        return <main className="flex-centered text-center main">
            <NavLink to="/signin">{t('common:errors.need_to_authorize')}</NavLink>
        </main>
    }

    if (!isLoading && projects.length === 0) {
        return (
            <main className="flex-centered main">
                <div style={{ maxWidth: '330px' }}>
                    <p style={{ fontSize: '23px' }}>{t('team:project.no_projects_msg')}</p>
                    <CreateProject />
                </div>
            </main>
        )
    }

    return (
<<<<<<< HEAD
        <>
            <div className={`team-sidebar`}>
                <TeamCoopSidebar
                    // minifySidebar={minifySidebar}
                    // type={sidebarType}
=======
        <div className={`work-board ${isCompact ? 'compact-sidebar' : 'full-sidebar'}`}>
            <div className="team-sidebar">
                <TeamCoopSidebar
                    minifySidebar={minifySidebar}
                    isCompact={isCompact}
>>>>>>> 9bf3a8a344c85fd949c3d314d367b833b5a2f513
                />
            </div>
            <main className="main">
                {activeProject &&
                <BoardInfo label={t('team:project.project_board', { title: activeProject.title })} />}
                <DraggableZone />
                <TeamCoopResult />
            </main>
        </div>
    )

<<<<<<< HEAD
    // function minifySidebar() {
    //     console.log('some')
    // }
=======
    function minifySidebar() {
        setCompact(!isCompact)
    }
>>>>>>> 9bf3a8a344c85fd949c3d314d367b833b5a2f513
}

export default TeamCoopPage
