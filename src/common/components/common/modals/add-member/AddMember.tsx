import React, {useEffect, useState} from "react"
import Rodal from "rodal"
import {useSelector, useDispatch} from "react-redux"
import style from "./add-member.module.scss"
import {GlobalStateType, IModalProps} from "../../../../../constants/types"
import Button from "../../buttons/button/Button"
import {GrUserAdd} from "react-icons/gr"
import {getAndDecodeData} from "encoded-data-parser"
import {createMember} from "../../../../actions/actionCreator"
import {useForm} from 'react-hook-form'
import {SET_ERROR} from "../../../../actions/actionTypes";

interface IForm {
    name: string
    position: string;
    encData: string;
}

export const AddMember: React.FC<IModalProps> = ({visible, closeModal}) => {

    useEffect(() => {
        if (!visible) {
            dispatch({type: SET_ERROR, errorMessage: ''})
            reset()
        }
    }, [visible])

    const dispatch = useDispatch()
    // const teams: Array<ITeamProfile> = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    // const errorApiMsg = useSelector((state: GlobalStateType) => state.teamsReducer.errorMessage)
    const user = useSelector((state: GlobalStateType) => state.userData)
    const {register, handleSubmit, reset, errors} = useForm<IForm>()

    return (
        <Rodal
            className='add-member-modal'
            visible={visible}
            onClose={() => {
                closeModal()
            }}
            height={500}
        >
            <div className={style.content}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className={`form-group`}>
                        <label htmlFor="">
                            <span>Имя работника</span>
                            <input
                                className={style.input}
                                type="text"
                                name="name"
                                ref={register({
                                    required: 'Это обязательное поле'
                                })}
                            />
                        </label>
                        {errors.name && <div className={`msg-error`}>{errors.name.message}</div>}
                    </div>
                    <div className={`form-group`}>
                        <label htmlFor="">
                            <span>Должность работника</span>
                            <input
                                className={style.input}
                                type="text"
                                name="position"
                                ref={register({
                                    required: 'Это обязательное поле'
                                })}
                            />
                        </label>
                        {errors.position && <div className={`msg-error`}>{errors.position.message}</div>}
                    </div>
                    <div className={`form-group`}>
                        <label htmlFor="">
                            <span>Результат теста</span>
                            <textarea
                                className={style.input}
                                name="encData"
                                ref={register({
                                    required: 'Это обязательное поле',
                                    validate: {
                                        decode: value => getAndDecodeData('', value).data !== null
                                    }
                                })}
                            />
                        </label>
                        {errors.encData && errors.encData.type === 'decode' && (
                            <div className={`msg-error`}>Значение невалидно</div>
                        )}
                        {errors.encData && <div className={`msg-error`}>{errors.encData.message}</div>}
                    </div>
                    <Button
                        title={'Добавить'}
                        startIcon={<GrUserAdd/>}
                        handle={() => void (0)}
                        btnClass={'btn-outlined'}
                    />

                </form>
            </div>
        </Rodal>
    )

    function submitForm(formData: IForm): void {

        const data = getAndDecodeData('', formData.encData)

        const memberData = {
            name: formData.name,
            position: formData.position,
            encData: data.encoded,
            decData: data.data,
        }

        dispatch(createMember(memberData, user.id, user.projects[0].id, user.token))
        closeModal()
        reset()
    }
}