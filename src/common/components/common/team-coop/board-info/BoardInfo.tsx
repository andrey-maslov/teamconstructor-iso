import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import style from './board-info.module.scss'
import {FiSave} from 'react-icons/fi'
import {GlobalStateType} from "../../../../../constants/types";
import Button from "../../buttons/button/Button";
import {updateProject} from "../../../../actions/actionCreator";
import {AiOutlineLoading} from "react-icons/ai";

const BoardInfo: React.FC = () => {

    const userData = useSelector((state: GlobalStateType) => state.userData)
    const teams = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    const appMode = useSelector((state: GlobalStateType) => state.appReducer)
    const dispatch = useDispatch()
    const {activeProject} = userData
    const {isLoading} = appMode

    if (!activeProject) {
        return null
    }

    return (
        <div className={style.wrapper}>
            <h2 className={style.title}>Доска проекта <span>{activeProject.title}</span></h2>
            <Button
                title={'Сохранить'}
                handle={() => {saveProjectHandle(activeProject.id)}}
                btnClass={`btn btn-outlined ${isLoading && 'btn-loader'}`}
                startIcon={!isLoading ? <FiSave/> : <AiOutlineLoading/>}
            />
        </div>
    );

    function saveProjectHandle(id:  number) {
        dispatch(updateProject(id, teams))
    }
}

export default BoardInfo;