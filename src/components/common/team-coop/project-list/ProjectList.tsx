import React from 'react'
import { useHistory } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { globalStoreType } from '../../../../constants/types'
import { deleteProject, fetchProject, setCreateProjectModal } from '../../../../actions/actionCreator'
import { VscProject } from "react-icons/vsc"
import style from './projects.module.scss'

const ProjectList: React.FC = () => {

    const history = useHistory()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { projects, activeProject } = useSelector((state: globalStoreType) => state.user)

    return (
        <>
            <div className={`${style.title} ${style.item}`}>
                <div>
                    <VscProject />
                    <span>{t('team:project.my_projects')}</span>
                </div>
                <button className={style.create} onClick={handlerCreate} />
            </div>
            <div className={style.listWrapper}>
                <ul className={style.list}>
                    {projects.length > 0 && activeProject ?
                        projects.map((project: { id: number, title: string }) => (
                            <li
                                className={`${style.item} ${activeProject.id === project.id ? style.active : ''}`}
                                key={project.id}
                            >
                                <button
                                    className={style.project}
                                    onClick={() => changeProject(activeProject.id, project.id)}
                                >
                                    <span>{project.title}</span>
                                </button>
                                <button className={style.delete} onClick={() => handlerDelete(project.id)} />
                            </li>
                        )) : (
                            <li>
                                <span>{t('team:project.no_projects')}</span>
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    )

    function handlerCreate() {
        dispatch(setCreateProjectModal(true))
    }

    function handlerDelete(projectId: number) {
        if (typeof window !== 'undefined' && window.confirm(t('common:confirm:do_delete_project'))) {

            // const newProjects = projects.length > 1 ? projects.filter((item: {id: number, title: string}) => item.id !== projectId) : []
            // const newActiveProject = newProjects.length > 0 ? {id: newProjects[0].id, title: newProjects[0].title} : null
            // console.log(newProjects, newActiveProject)
            dispatch(deleteProject(projectId))
            // setIsOpen(false)
        }
    }

    function changeProject(current: number, id: number) {
        if (current !== id) {
            dispatch(fetchProject(id))
        } else {
            console.log('active project is current')
        }
        if (history.location.pathname !== '/team') {
            history.push('/team')
        }
    }
}

export default ProjectList
