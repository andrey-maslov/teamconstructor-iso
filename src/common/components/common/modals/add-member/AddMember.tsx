import React, {useEffect, useState} from "react"
import Rodal from "rodal"
import {useSelector, useDispatch} from "react-redux"
import style from "./add-member.module.scss"
import {GlobalStateType, IModalProps, ITeam, IMember, DecodedDataType} from "../../../../../constants/types"
import Button from "../../buttons/button/Button"
import {GrUserAdd} from "react-icons/gr"
import {getAndDecodeData} from "encoded-data-parser"
import {useForm} from 'react-hook-form'
import {setAddMemberModal, setEditedMember, setTeamsData} from "../../../../actions/actionCreator";

interface IForm {
    name: string
    position: string;
    encData: string;
}

export const AddMember: React.FC<IModalProps> = ({visible, closeModal}) => {

    useEffect(() => {
        if (!visible) {
            reset()
            dispatch(setEditedMember(null))
        }
    }, [visible])

    const dispatch = useDispatch()
    const teams: Array<ITeam> = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    const editedMember: number | null = useSelector((state: GlobalStateType) => state.teamCoopReducer.editedMember)
    const {register, handleSubmit, reset, errors} = useForm<IForm>()
    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []

    let defaultProfile = {name: '', position: '', encData: ''}

    if (editedMember) {
        const member = members.filter((item: IMember) => item.baseID === editedMember)[0]
        defaultProfile = {name: member.name, position: member.position, encData: btoa(JSON.stringify(member.decData))}
    }

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
                                defaultValue={defaultProfile.name}
                                ref={register({
                                    required: 'Это обязательное поле',
                                    validate: {
                                        duplicateName: value => !isDuplicateName(value, members, editedMember)
                                    }
                                })}
                            />
                        </label>
                        {errors.name && errors.name.type === 'duplicateName' && (
                            <div className={`msg-error`}>Работник с таким именем уже есть</div>
                        )}
                        {errors.name && <div className={`msg-error`}>{errors.name.message}</div>}
                    </div>
                    <div className={`form-group`}>
                        <label htmlFor="">
                            <span>Должность работника</span>
                            <input
                                className={style.input}
                                type="text"
                                name="position"
                                defaultValue={defaultProfile.position}
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
                                defaultValue={defaultProfile.encData}
                                ref={register({
                                    required: 'Это обязательное поле',
                                    validate: {
                                        decode: value => getAndDecodeData('', value).data !== null,
                                        duplicate: value => !isDuplicateData(getAndDecodeData('', value).data, members, editedMember)
                                    }
                                })}
                            />
                        </label>
                        {errors.encData && errors.encData.type === 'decode' && (
                            <div className={`msg-error`}>Значение невалидно</div>
                        )}
                        {errors.encData && errors.encData.type === 'duplicate' && (
                            <div className={`msg-error`}>Работник с таким результатом уже есть</div>
                        )}
                        {errors.encData && <div className={`msg-error`}>{errors.encData.message}</div>}
                    </div>
                    <Button
                        title={editedMember ? 'Сохранить' : 'Добавить'}
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


        let newTeams = [...teams]

        if (!editedMember) {
            newTeams[0].items.push(newMember)
        } else {
            console.log(newMember)
            newTeams = [...teams].map(team => {
                return {
                    ...team,
                    items: team.items.map((item: IMember) => {
                        if (item.baseID === editedMember) {
                            return {
                                ...item,
                                name: newMember.name,
                                position: newMember.position,
                                decData: newMember.decData,
                            }
                        }
                        return item
                    })
                }
            })
        }

        dispatch(setTeamsData(newTeams))

        setTimeout(() => {
            dispatch(setAddMemberModal(false))
        }, 500)
    }

    function isDuplicateData(data: DecodedDataType, members: IMember[], edMember: number | null): boolean {
        const strData = JSON.stringify(data)
        const dataList = members.filter(member => member.baseID !== edMember).map(member => JSON.stringify(member.decData))
        return dataList.includes(strData)
    }

    function isDuplicateName(name: string, members: IMember[], edMember: number | null): boolean {
        const names = members.filter(member => member.baseID !== edMember).map(member => member.name)
        return names.includes(name)
    }
}