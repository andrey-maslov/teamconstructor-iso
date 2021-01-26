import React from 'react'
import { useHistory } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { anyType, globalStoreType, IProjectShort } from '../../../../constants/types'
import { deleteProject, fetchProjectList, setCreateProjectModal } from '../../../../actions/actionCreator'
import { VscProject } from "react-icons/vsc"
import style from './projects.module.scss'
import { SET_ACTIVE_PROJECT } from "../../../../actions/actionTypes";
import { confirmAlert } from "react-confirm-alert";
import { getCookieFromBrowser } from "../../../../helper/cookie";

const ProjectList: React.FC = () => {

    const history = useHistory()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { projects, activeProject: { id } } = useSelector((state: globalStoreType) => state.team)

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
                    {projects.length > 0 && id ?
                        projects.map((project: IProjectShort) => (
                            <li
                                className={`${style.item} ${id === project.id ? style.active : ''}`}
                                key={project.id}
                            >
                                <button
                                    className={style.project}
                                    onClick={() => changeProject(id, project.id)}
                                >
                                    <span>{project.title}</span>
                                </button>
                                <button className={style.delete} onClick={() => handlerDelete(project.id)} />
                            </li>
                        )) : (
                            <li className={style.empty}>
                                <p>{t('team:project.no_projects')}</p>
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

    function handlerDelete(projectId: string) {

        confirmAlert({
            title: t('team:project.removal'),
            message: t('common:confirm.do_delete_project'),
            buttons: [
                {
                    label: t('common:confirm.no'),
                    onClick: () => null
                },
                {
                    label: t('common:confirm.delete'),
                    onClick: () => dispatch(deleteProject(projectId))
                }
            ],
            overlayClassName: "alert-overlay confirm-danger",
        });
    }

    function changeProject(current: string, id: string) {
        if (current !== id) {
            const token = getCookieFromBrowser('token')
            dispatch(fetchProjectList(token, id))
        } else {
            console.log('active project is current')
        }
        if (history.location.pathname !== '/team') {
            history.push('/team')
        }
    }
}

export default ProjectList
