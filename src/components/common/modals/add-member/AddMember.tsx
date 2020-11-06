import React, { useEffect } from 'react'
import Rodal from 'rodal'
import { useSelector, useDispatch } from 'react-redux'
import style from './add-member.module.scss'
import { globalStoreType, IModalProps, ITeam } from '../../../../constants/types'
import Button from '../../buttons/button/Button'
import { GrUserAdd } from 'react-icons/gr'
import { IMember, DecodedDataType } from 'psychology/build/main/types/types'
import { getAndDecodeData } from 'psychology'
import { useForm } from 'react-hook-form'
import { setEditedMember, updateProject } from '../../../../actions/actionCreator'
import { AiOutlineLoading } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'

interface IForm {
    name: string
    position: string;
    encData: string;
}

export const AddMember: React.FC<IModalProps> = ({ visible, closeModal }) => {

    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { register, handleSubmit, reset, errors } = useForm<IForm>({ criteriaMode: 'all' })

    useEffect(() => {
        return function clearAll() {
            reset()
            dispatch(setEditedMember(null))
        }
    }, [])

    const { teams, editedMember } = useSelector((state: globalStoreType) => state.team)
    const { activeProject } = useSelector((state: globalStoreType) => state.user)
    const { isLoading, errorApiMessage } = useSelector((state: globalStoreType) => state.app)
    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []
    let defaultProfile = { name: '', position: '', encData: '' }

    if (editedMember !== null) {
        const member = members.filter((item: IMember) => item.baseID === editedMember)[0]
        defaultProfile = { name: member.name, position: member.position, encData: btoa(JSON.stringify(member.decData)) }
    }


    return (
        <Rodal
            className='add-member-modal'
            visible={visible}
            onClose={closeModal}
            width={340}
            height={460}
        >
            <div className={style.content}>
                <form onSubmit={handleSubmit(submitForm)}>
                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                        <label>
                            <span>{t('team:member_name')}</span>
                            <input
                                className={style.input}
                                type="text"
                                name="name"
                                defaultValue={defaultProfile.name}
                                ref={register({
                                    required: `${t('common:errors.required')}`,
                                    validate: {
                                        duplicateName: value => !isDuplicateName(value, members, editedMember)
                                    }
                                })}
                            />
                        </label>
                        {errors.name && errors.name.type === 'duplicateName' && (
                            <div className={`item-explain`}>`${t('common:errors.duplicate_member_name')}`</div>
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
                                    required: `${t('common:errors.required')}`
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
                                    required: `${t('common:errors.required')}`,
                                    validate: {
                                        decode: value => getAndDecodeData('', value).data !== null,
                                        duplicate: value => !isDuplicateData(getAndDecodeData('', value).data, members, editedMember)
                                    }
                                })}
                            />
                        </label>
                        {errors.encData && errors.encData.type === 'decode' && (
                            <div className={`item-explain`}>${t('common:errors.invalid')}</div>
                        )}
                        {errors.encData && errors.encData.type === 'duplicate' && (
                            <div className={`item-explain`}>${t('common:errors.duplicate_member_result')}</div>
                        )}
                        {errors.encData && errors.encData.type !== 'decode' && errors.encData.type !== 'duplicate' &&
                        <div className={`item-explain`}>{errors.encData.message}</div>}
                    </div>
                    <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                        <Button
                            title={editedMember ? t('common:buttons.save') : t('common:buttons.add')}
                            startIcon={isLoading ? <AiOutlineLoading /> : <GrUserAdd />}
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

        if (data.data === null) {
            return
        }

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

        if (editedMember === null) {
            newTeams[0].items.push(newMember)
            dispatch(updateProject(activeProject.id, { pool: newTeams[0] }))
            console.log('add')
        } else {
            console.log('edit')
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
            dispatch(updateProject(activeProject.id, { pool: newTeams[0], teams: newTeams.slice(1) }))
        }
    }

    function isDuplicateData(data: DecodedDataType | null, members: IMember[], edMember: number | null): boolean {
        const strData = JSON.stringify(data)
        const dataList = members.filter(member => member.baseID !== edMember).map(member => JSON.stringify(member.decData))
        return dataList.includes(strData)
    }

    function isDuplicateName(name: string, members: IMember[], edMember: number | null): boolean {
        const names = members.filter(member => member.baseID !== edMember).map(member => member.name)
        return names.includes(name)
    }
}