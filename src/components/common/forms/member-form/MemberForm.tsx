import Button from "../../buttons/button/Button";
import { AiOutlineLoading } from "react-icons/ai";
import { GrUserAdd } from "react-icons/gr";
import React, { useEffect } from "react";
import { globalStoreType, IMemberForm } from "../../../../constants/types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DecodedDataType, IMember } from "psychology/build/main/types/types";
import { setEditedMember } from "../../../../actions/actionCreator";
import { extractEncData } from "../../../../helper/helper";

interface IMemberFormProps {
    memberData: IMemberForm
    submitForm: (formData: IMemberForm) => void
}

const MemberForm: React.FC<IMemberFormProps> = ({ memberData, submitForm }) => {

    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { register, handleSubmit, errors, reset } = useForm<IMemberForm>({ criteriaMode: 'all' })
    const { isLoading, errorApiMessage } = useSelector((state: globalStoreType) => state.app)
    const { editedMember, teams } = useSelector((state: globalStoreType) => state.team)
    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []

    useEffect(() => {
        return function clearAll() {
            reset()
            dispatch(setEditedMember(null))
        }
    }, [])

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                <div><strong>Внесите данные в форму:</strong></div>
                <label>
                    <span>{t('team:member_name')}</span>
                    <input
                        type="text"
                        name="name"
                        placeholder="Имя"
                        defaultValue={memberData.name}
                        ref={register({
                            required: `${t('common:errors.required')}`,
                            validate: {
                                duplicateName: value => !isDuplicateName(value, members, editedMember)
                            }
                        })}
                    />
                </label>
                {errors.name && errors.name.message && <div className={`item-explain`}>{errors.name.message}</div>}
                {errors.name && errors.name.type === 'duplicateName' && (
                    <div className={`item-explain`}>{t('common:errors.duplicate_member_name')}</div>
                )}
            </div>
            <div className={`form-group ${errors.position ? 'has-error' : ''}`}>
                <label>
                    <span>Должность работника</span>
                    <input
                        type="text"
                        name="position"
                        placeholder="Должность"
                        defaultValue={memberData.position}
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
                        name="encData"
                        placeholder="Результат тестирования"
                        defaultValue={memberData.encData}
                        ref={register({
                            required: `${t('common:errors.required')}`,
                            validate: {
                                decode: value => extractEncData(value).data !== null,
                                duplicate: value => !isDuplicateData(extractEncData(value).data, members, editedMember)
                            }
                        })}
                    />
                </label>
                {errors.encData && errors.encData.type === 'decode' && (
                    <div className={`item-explain`}>{t('common:errors.invalid')}</div>
                )}
                {errors.encData && errors.encData.type === 'duplicate' && (
                    <div className={`item-explain`}>{t('common:errors.duplicate_member_result')}</div>
                )}
                {errors.encData && errors.encData.message && <div className={`item-explain`}>{errors.encData.message}</div>}
            </div>
            <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                <Button
                    title={editedMember !== null ? t('common:buttons.save') : t('common:buttons.add')}
                    startIcon={isLoading ? <AiOutlineLoading /> : <GrUserAdd />}
                    handle={() => void (0)}
                    btnClass={'btn-outlined'}
                />
                {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
            </div>
        </form>
    )

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

export default MemberForm

