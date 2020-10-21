import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import DraggableZone from '../../common/team-coop/DraggableZone'
import TeamCoopResult from '../../common/team-coop/team-coop-result/TeamCoopResult'
import TeamCoopSidebar from '../../common/team-coop/team-coop-sidebar/TeamCoopSidebar'
import { GlobalStateType } from '../../../../constants/types'
import CreateProject from '../../common/team-coop/create-project/CreateProject'
import BoardInfo from '../../common/team-coop/board-info/BoardInfo'
import { useTranslation } from 'react-i18next'

const TeamCoopPage: React.FC = () => {

    const { t } = useTranslation()
    const { isLoggedIn, projects, activeProject } = useSelector((state: GlobalStateType) => state.userData)
    const { isLoading } = useSelector((state: GlobalStateType) => state.appReducer)


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
        <>
            <div className={`team-sidebar`}>
                <TeamCoopSidebar />
            </div>
            <main className="main">
                <div className="content">
                    {activeProject &&
                    <BoardInfo label={t('team:project.project_board', { title: activeProject.title })} />}
                    <DraggableZone />
                    <TeamCoopResult />
                </div>
            </main>
        </>
    );
};

export default TeamCoopPage;

// Доска проекта <span>{project.title}</span>