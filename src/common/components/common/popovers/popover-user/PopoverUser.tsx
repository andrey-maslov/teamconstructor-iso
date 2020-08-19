import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import style from "./popover-user.module.scss"
import {FiUser, FiUserCheck, FiLogOut, FiChevronDown, FiStar} from "react-icons/fi"
import {Popover} from "../Popover"
import OutsideClickHandler from 'react-outside-click-handler'
import {GlobalStateType} from "../../../../../constants/types";
import {deleteProject, fetchProject, setCreateProjectModal} from "../../../../actions/actionCreator";

interface PopoverUserProps {
    userEmail: string
    logoutHandle: () => void
}

const PopoverUser: React.FC<PopoverUserProps> = ({userEmail, logoutHandle}) => {

    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const userData = useSelector((state: GlobalStateType) => state.userData)
    const {projects, activeProject, email} = userData
    const token: string = useSelector((state: GlobalStateType) => state.userData.token)

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

                <button className={style.profile} onClick={() => {
                    setIsOpen(!isOpen)
                }}>
                    <FiUser/>
                    <FiChevronDown/>
                </button>

                <Popover isVisible={isOpen} className='user-popover'>
                    <ul className={style.links}>
                        <li>
                            <p className={`${style.item} ${style.creds}`}>
                                <FiUserCheck/>
                                <span>{userEmail}</span>
                            </p>
                        </li>
                    </ul>

                    <div className={style.title}>
                        <div>
                            <FiStar/>
                            <span>Мои проекты</span>
                        </div>
                        <button
                            className={style.create}
                            onClick={handlerCreate}
                        >
                            +
                        </button>
                    </div>
                    <ul className={style.links}>
                        {projects.length > 0 ?
                            projects.map((project: {id: number, title: string}) => (
                            <li key={project.id} className={`${activeProject === project.id ? style.active : ''}`}>
                                <button
                                    className={style.item}
                                    onClick={() => {changeProject(project.id)}}
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
                                <span>У вас нет проектов</span>
                            </li>}
                    </ul>

                    <button className={style.item} onClick={logoutHandle}>
                        <FiLogOut/>
                        <span>Logout</span>
                    </button>
                </Popover>
            </div>
        </OutsideClickHandler>
    );

    function handlerCreate() {
        dispatch(setCreateProjectModal(true))
    }


    function handlerDelete(projectId: number) {
        if (window.confirm("Вы действительно хотите удалить проект?")){
            const newProjects = projects.filter((item: {id: number, title: string}) => item.id !== projectId)
            const newActiveProject = newProjects.length > 0 ? newProjects[0].id : null
            dispatch(deleteProject(projectId, newProjects, newActiveProject, token))
        }
    }


    function changeProject(id: number) {
        dispatch(fetchProject(id, token))
    }
}

export default PopoverUser;