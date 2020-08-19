import React, {useEffect, useState} from "react"
import Rodal from "rodal"
import {useSelector, useDispatch} from "react-redux"
import style from "./add-member.module.scss"
import {GlobalStateType, IModalProps, ITeamProfile, IMember} from "../../../../../constants/types"
import Button from "../../buttons/button/Button"
import {GrUserAdd} from "react-icons/gr"
import {getAndDecodeData} from "encoded-data-parser"
import {useForm} from 'react-hook-form'
import {setAddMemberModal, setTeamsData} from "../../../../actions/actionCreator";

interface IForm {
    name: string
    position: string;
    encData: string;
}

export const AddMember: React.FC<IModalProps> = ({visible, closeModal}) => {

    useEffect(() => {
        if (!visible) {
            reset()
        }
    }, [visible])

    const dispatch = useDispatch()
    const teams: Array<ITeamProfile> = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
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

        //generate new base id as max of list of ids + 1
        const baseIdList = teams[0].items.map((item: IMember) => item.baseID)
        const newBaseID = baseIdList.length !== 0 ? Math.max.apply(null, baseIdList) + 1 : 0

        const newMember: IMember = {
            id: `0-${new Date().getTime()}`,
            name: formData.name,
            position: formData.position,
            decData: data.data,
            baseID: newBaseID
        }

        const newTeams = [...teams]
        newTeams[0].items.push(newMember)
        dispatch(setTeamsData(newTeams))

        setTimeout(()=> {dispatch(setAddMemberModal(false))}, 500)
    }
}