import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import style from "./popover-user.module.scss"
import {FiUser, FiUserCheck, FiLogOut, FiChevronDown, FiStar} from "react-icons/fi"
import {Popover} from "../Popover"
import {useTranslation} from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import {GlobalStateType} from "../../../../../constants/types"
import {deleteProject, fetchProject, setCreateProjectModal} from "../../../../actions/actionCreator"

interface PopoverUserProps {
    logoutHandle: () => void
}

const PopoverUser: React.FC<PopoverUserProps> = ({ logoutHandle}) => {

    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const userData = useSelector((state: GlobalStateType) => state.userData)
    const {projects, activeProject, email, username} = userData
    const {t} = useTranslation();

    const outsideClickHandler = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        if (activeProject) {
            changeProject(activeProject.id)
        }
    }, [])

    return (
        <OutsideClickHandler
            onOutsideClick={outsideClickHandler}
        >
            <div className={style.wrapper}>

                <button className={style.openBtn} onClick={() => {
                    setIsOpen(!isOpen)
                }}>
                    <FiUser/>
                    <FiChevronDown/>
                </button>

                <Popover isVisible={isOpen} className={`user-popover ${style.body}`}>
                    <ul className={style.links}>
                        <li>
                            <p className={`${style.item} ${style.creds}`}>
                                <FiUserCheck/>
                                <span>{username ? username : email}</span>
                            </p>
                        </li>
                    </ul>

                    <div className={style.title}>
                        <div>
                            <FiStar/>
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
                            projects.map((project: {id: number, title: string}) => (
                            <li key={project.id} className={`${activeProject.id === project.id ? style.active : ''}`}>
                                <button
                                    className={style.item}
                                    onClick={() => {
                                        activeProject.id !== project.id ? changeProject(project.id) : console.log('active project is current')
                                    }}
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
                        <FiLogOut/>
                        <span>{t('common:buttons.logOut')}</span>
                    </button>
                </Popover>
            </div>
        </OutsideClickHandler>
    );

    function handlerCreate() {
        dispatch(setCreateProjectModal(true))
    }


    function handlerDelete(projectId: number) {
        if (typeof window !== 'undefined' && window.confirm("Вы действительно хотите удалить проект?")){

            // const newProjects = projects.length > 1 ? projects.filter((item: {id: number, title: string}) => item.id !== projectId) : []
            // const newActiveProject = newProjects.length > 0 ? {id: newProjects[0].id, title: newProjects[0].title} : null
            // console.log(newProjects, newActiveProject)
            dispatch(deleteProject(projectId))
            setIsOpen(false)
        }
    }

    function changeProject(id: number) {
        dispatch(fetchProject(id))
        setIsOpen(false)
    }
}

export default PopoverUser;