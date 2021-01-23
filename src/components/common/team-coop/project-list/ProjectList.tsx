import React from 'react'
import { useHistory } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { globalStoreType } from '../../../../constants/types'
import { deleteProject, setCreateProjectModal } from '../../../../actions/actionCreator'
import { VscProject } from "react-icons/vsc"
import style from './projects.module.scss'
import { SET_ACTIVE_PROJECT } from "../../../../actions/actionTypes";
import { confirmAlert } from "react-confirm-alert";

const ProjectList: React.FC = () => {

    const history = useHistory()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { projects, activeProject } = useSelector((state: globalStoreType) => state.team)

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
                                    onClick={() => changeProject(activeProject.id, project.id, project.title)}
                                >
                                    <span>{project.title}</span>
                                </button>
                                <button className={style.delete} onClick={() => handlerDelete(project.id)} />
                            </li>
                        )) : (
                            <li className={style.empty}>
                                <p >{t('team:project.no_projects')}</p>
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

        confirmAlert({
            title: 'Удаление проекта',
            message: t('common:confirm:do_delete_project'),
            buttons: [
                {
                    label: 'Нет',
                    onClick: () => null
                },
                {
                    label: 'Удалить',
                    onClick: () => dispatch(deleteProject(projectId))
                }
            ],
            overlayClassName: "alert-overlay confirm-danger",
        });
    }

    function changeProject(current: number, id: number, title: string) {
        if (current !== id) {
            dispatch({ type: SET_ACTIVE_PROJECT, activeProject: { id, title } })
        } else {
            console.log('active project is current')
        }
        if (history.location.pathname !== '/team') {
            history.push('/team')
        }
    }
}

export default ProjectList
