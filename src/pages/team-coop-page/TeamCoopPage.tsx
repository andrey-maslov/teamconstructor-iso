import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import DraggableZone from '../../components/common/team-coop/DraggableZone'
import TeamCoopResult from '../../components/common/team-coop/team-coop-result/TeamCoopResult'
import TeamCoopSidebar from '../../components/common/team-coop/team-coop-sidebar/TeamCoopSidebar'
import { globalStoreType } from '../../constants/types'
import CreateProject from '../../components/common/team-coop/create-project/CreateProject'
import BoardInfo from '../../components/common/team-coop/board-info/BoardInfo'
import { useTranslation } from 'react-i18next'
import { useMediaPredicate } from "react-media-hook"
import { checkUserAccess } from "../../helper/helper";
import { EXTENDED_ACCESS_LIST } from "../../constants/constants";

const TeamCoopPage: React.FC = () => {

    const { t } = useTranslation()
    const isMedium = useMediaPredicate('(max-width: 1400px)')
    const [isCompact, setCompact] = useState(isMedium)
    const { isLoggedIn, tariffId } = useSelector((state: globalStoreType) => state.user)
    const { activeProject: { title }, projects } = useSelector((state: globalStoreType) => state.team)
    const { isLoading } = useSelector((state: globalStoreType) => state.app)


    if (!isLoggedIn || !checkUserAccess<number>(EXTENDED_ACCESS_LIST, tariffId)) {
        return (
            <main className="flex-centered text-center main">
                <NavLink to="/signin">{t('common:errors.need_to_authorize')}</NavLink>
            </main>
        )
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
        <div className={`work-board ${isCompact ? 'compact-sidebar' : 'full-sidebar'}`}>
            <div className="team-sidebar">
                <TeamCoopSidebar
                    minifySidebar={minifySidebar}
                    isCompact={isCompact}
                />
            </div>
            <main className="main">
                {title &&
                <BoardInfo label={t('team:project.project_board', { title })} />}
                <DraggableZone />
                <TeamCoopResult />
            </main>
        </div>
    )

    function minifySidebar() {
        setCompact(!isCompact)
    }
}

export default TeamCoopPage
