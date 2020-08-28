import React, {useEffect, useState} from "react"
import Rodal from "rodal"
import {useSelector, useDispatch} from "react-redux"
import style from "./add-member.module.scss"
import {GlobalStateType, IModalProps, ITeam, IMember, DecodedDataType} from "../../../../../constants/types"
import Button from "../../buttons/button/Button"
import {GrUserAdd} from "react-icons/gr"
import {getAndDecodeData} from "encoded-data-parser"
import {useForm} from 'react-hook-form'
import {setAddMemberModal, setEditedMember, setTeamsData, updateProject} from "../../../../actions/actionCreator";
import {AiOutlineLoading} from "react-icons/ai";


interface IForm {
    name: string
    position: string;
    encData: string;
}

export const AddMember: React.FC<IModalProps> = ({visible, closeModal}) => {

    useEffect(() => {
        return function clearAll() {
            reset()
            dispatch(setEditedMember(null))
        }
    }, [])

    const dispatch = useDispatch()
    const teams: Array<ITeam> = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    const editedMemberId: number | null = useSelector((state: GlobalStateType) => state.teamCoopReducer.editedMember)
    const {activeProject} = useSelector((state: GlobalStateType) => state.userData)
    const {isLoading, errorApiMessage} = useSelector((state: GlobalStateType) => state.appReducer)
    const {register, handleSubmit, reset, errors} = useForm<IForm>({criteriaMode: 'all'})
    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []

    let defaultProfile = {name: '', position: '', encData: ''}

    if (editedMemberId !== null) {
        const member = members.filter((item: IMember) => item.baseID === editedMemberId)[0]
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
                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                        <label>
                            <span>Имя работника</span>
                            <input
                                className={style.input}
                                type="text"
                                name="name"
                                defaultValue={defaultProfile.name}
                                ref={register({
                                    required: 'Это обязательное поле',
                                    validate: {
                                        duplicateName: value => !isDuplicateName(value, members, editedMemberId)
                                    }
                                })}
                            />
                        </label>
                        {errors.name && errors.name.type === 'duplicateName' && (
                            <div className={`item-explain`}>Работник с таким именем уже есть</div>
                        )}
                        {errors.name && <div className={`item-explain`}>{errors.name.message}</div>}
                    </div>
                    <div className={`form-group ${errors.position ? 'has-error' : ''}`}>
                        <label>
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
                        {errors.position && <div className={`item-explain`}>{errors.position.message}</div>}
                    </div>
                    <div className={`form-group ${errors.encData ? 'has-error' : ''}`}>
                        <label>
                            <span>Результат теста</span>
                            <textarea
                                className={style.input}
                                name="encData"
                                defaultValue={defaultProfile.encData}
                                ref={register({
                                    required: 'Это обязательное поле',
                                    validate: {
                                        decode: value => getAndDecodeData('', value).data !== null,
                                        duplicate: value => !isDuplicateData(getAndDecodeData('', value).data, members, editedMemberId)
                                    }
                                })}
                            />
                        </label>
                        {errors.encData && errors.encData.type === 'decode' && (
                            <div className={`item-explain`}>Значение невалидно</div>
                        )}
                        {errors.encData && errors.encData.type === 'duplicate' && (
                            <div className={`item-explain`}>Работник с таким результатом уже есть</div>
                        )}
                        {errors.encData && errors.encData.type !== 'decode' && errors.encData.type !== 'duplicate' &&
                        <div className={`item-explain`}>{errors.encData.message}</div>}
                    </div>
                    <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                        <Button
                            title={editedMemberId ? 'Сохранить' : 'Добавить'}
                            startIcon={isLoading ? <AiOutlineLoading/> : <GrUserAdd/>}
                            handle={() => void (0)}
                            btnClass={'btn-outlined'}
                        />
                        {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
                    </div>

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

        if (editedMemberId === null) {
            newTeams[0].items.push(newMember)
            dispatch(updateProject(activeProject.id, {pool: newTeams[0]}))
            console.log('add')
        } else {
            console.log('edit')
            newTeams = [...teams].map(team => {
                return {
                    ...team,
                    items: team.items.map((item: IMember) => {
                        if (item.baseID === editedMemberId) {
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
            dispatch(updateProject(activeProject.id, {pool: newTeams[0], teams: newTeams.slice(1)}))
        }
        // dispatch(setTeamsData(newTeams))

        // setTimeout(() => {
        //     dispatch(setAddMemberModal(false))
        // }, 500)
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