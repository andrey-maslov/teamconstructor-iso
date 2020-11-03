import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom"
import style from './popover-user.module.scss'
import { FiUser, FiUserCheck, FiLogOut, FiChevronDown, FiStar } from 'react-icons/fi'
import { Popover } from '../Popover'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { globalStoreType } from '../../../../../constants/types'
import { deleteProject, fetchProject, setCreateProjectModal } from '../../../../actions/actionCreator'

interface PopoverUserProps {
    logoutHandle: () => void
    setProject: (id: number) => void
}

const PopoverUser: React.FC<PopoverUserProps> = ({ logoutHandle, setProject }) => {

    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const { projects, activeProject, email, username } = useSelector((state: globalStoreType) => state.user)
    const { t } = useTranslation()
    const history = useHistory()

    const outsideClickHandler = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    }

    return (
        <OutsideClickHandler
            onOutsideClick={outsideClickHandler}
        >
            <div className={style.wrapper}>

                <button className={style.openBtn} onClick={() => {
                    setIsOpen(!isOpen)
                }}>
                    <FiUser />
                    <FiChevronDown />
                </button>

                <Popover isVisible={isOpen} className={`user-popover ${style.body}`}>
                    <ul className={style.links}>
                        <li>
                            <p className={`${style.item} ${style.creds}`}>
                                <FiUserCheck />
                                <span>{username ? username : email}</span>
                            </p>
                        </li>
                    </ul>

                    <div className={style.title}>
                        <div>
                            <FiStar />
                            <span>{t('team:project.my_projects')}</span>
                        </div>
                        <button
                            className={style.create}
                            onClick={handlerCreate}
                        >
                            +
                        </button>
                    </div>
                    <ul className={style.links}>
                        {projects.length > 0 && activeProject ?
                            projects.map((project: { id: number, title: string }) => (
                                <li key={project.id}
                                    className={`${activeProject.id === project.id ? style.active : ''}`}>
                                    <button
                                        className={style.item}
                                        onClick={() => changeProject(activeProject.id, project.id)}
                                    >
                                        <span>{project.title}</span>
                                    </button>
                                    <button
                                        className={style.delete}
                                        onClick={() => handlerDelete(project.id)}
                                    >
                                        -
                                    </button>
                                </li>
                            )) :
                            <li>
                                <span>{t('team:project.no_projects')}</span>
                            </li>}
                    </ul>

                    <button className={style.item} onClick={logoutHandle}>
                        <FiLogOut />
                        <span>{t('common:buttons.logOut')}</span>
                    </button>
                </Popover>
            </div>
        </OutsideClickHandler>
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
            setIsOpen(false)
        }
    }

    function changeProject(current: number, id: number) {
        if (current !== id) {
            setProject(id)
            setIsOpen(false)
        } else {
            console.log('active project is current')
        }
        if (history.location.pathname !== '/team') {
            history.push('/team')
        }
    }
}

export default PopoverUser
