import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import {FaCircleNotch} from 'react-icons/fa'
import {GlobalStateType} from "../../../../../constants/types"
import {clearApiError, createProject} from "../../../../actions/actionCreator"
import Button from "../../buttons/button/Button"

import style from './create-project.module.scss'

interface IForm {
    title: string
}

const CreateProject: React.FC = () => {

    const userData = useSelector((state: GlobalStateType) => state.userData)
    const appMode = useSelector((state: GlobalStateType) => state.appReducer)
    const dispatch = useDispatch()
    const {register, handleSubmit, reset, errors} = useForm<IForm>()
    const {errorApiMsg, id, token} = userData
    const {isLoading} = appMode


    return (
        <div className={style.wrapper}>
            <div>
                <div className={style.title}>
                    <p>У вас еще нет ниодного проекта. <br/>Создайте свой первый проект</p>
                </div>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className={`form-group`}>
                        <label>
                            <span>Название</span>
                            <input
                                type="text"
                                name="title"
                                onChange={() => dispatch(clearApiError())}
                                ref={register({
                                    required: 'Это обязательное поле'
                                })}
                                autoComplete="off"
                                placeholder={'Введите название проекта'}
                            />
                        </label>
                        {errors.title && <div className={`msg-error`}>{errors.title.message}</div>}
                    </div>
                    <Button
                        title={'Создать'}
                        startIcon={isLoading && <FaCircleNotch/>}
                        handle={() => void (0)}
                        btnClass={'btn-outlined btn-loader'}
                    />
                    {errorApiMsg && <div className={`msg-error`}>{errorApiMsg}</div>}
                </form>
            </div>
        </div>
    );

    function submitForm(data: IForm): void {

        console.log('new project front OK')

        dispatch(createProject(id, data.title, token))
        // reset()
    }
}

export default CreateProject;