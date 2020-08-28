import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import {AiOutlineLoading} from 'react-icons/ai'
import {GlobalStateType} from "../../../../../constants/types"
import {createProject} from "../../../../actions/actionCreator"
import Button from "../../buttons/button/Button"

import style from './create-project.module.scss'
import {SET_ERROR} from "../../../../actions/actionTypes";

interface IForm {
    title: string
}

const CreateProject: React.FC = () => {

    const {isLoading, errorApiMessage} = useSelector((state: GlobalStateType) => state.appReducer)
    const dispatch = useDispatch()
    const {register, handleSubmit, errors} = useForm<IForm>()


    return (
        <form onSubmit={handleSubmit(submitForm)} className={style.form}>
            <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
                <label>
                    <span>Название</span>
                    <input
                        type="text"
                        name="title"
                        onChange={() => dispatch({type: SET_ERROR, errorApiMessage: ''})}
                        ref={register({
                            required: 'Это обязательное поле'
                        })}
                        autoComplete="off"
                        placeholder={'Введите название проекта'}
                    />
                </label>
                {errors.title && <div className={`item-explain`}>{errors.title.message}</div>}
            </div>
            <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                <Button
                    title={'Создать'}
                    startIcon={isLoading && <AiOutlineLoading/>}
                    handle={() => void (0)}
                    btnClass={'btn-outlined btn-loader'}
                />
                {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
            </div>

        </form>

    );

    function submitForm(data: IForm): void {
        dispatch(createProject(data.title, {title: 'pool', id: 0, items: []}, [{title: 'команда 1', id: 1, items: []}]))
    }
}

export default CreateProject;