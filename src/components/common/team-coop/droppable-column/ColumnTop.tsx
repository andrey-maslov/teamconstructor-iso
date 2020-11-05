import React, {useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {FiMinusCircle} from "react-icons/fi"
import {useForm} from 'react-hook-form'

import style from './droppable-column.module.scss'
import OutsideClickHandler from 'react-outside-click-handler'
import {globalStoreType, ITeam} from "../../../../constants/types";
import {updateProject} from "../../../../actions/actionCreator";
import {useTranslation} from "react-i18next";

interface IForm {
    label: string
}

interface ColumnTop {
    label: string
    deleteHandler: (colIndex: number) => void
    columnIndex: number
}

const ColumnTop: React.FC<ColumnTop> = ({deleteHandler, label, columnIndex}) => {

    const {t} = useTranslation()
    const [isEdit, setEdit] = useState(false)
    const teams: ITeam[] = useSelector((state: globalStoreType) => state.team.teams)
    const {activeProject} = useSelector((state: globalStoreType) => state.user)
    const dispatch = useDispatch()
    const {register, handleSubmit, errors, reset} = useForm<IForm>()
    const labels: string[] = teams.length > 1 ? teams.map(team => team.title.toLowerCase()) : []

    return (
        <div className={style.top}>
            {isEdit ?
                <OutsideClickHandler
                    onOutsideClick={() => setEdit(!isEdit)}
                >
                    <form onSubmit={handleSubmit(submit)}>
                        <div className={`form-group ${errors.label ? 'has-error' : ''} ${style.group}`}>
                            <input
                            type="text"
                            name="label"
                            defaultValue={label}
                            className={style.titleInput}
                            onFocus={(e: any) => e.target.select()}
                            autoFocus={true}
                            ref={register({
                                required: `${t('common:errors.required')}`,
                                validate: {
                                    duplicateLabel: value => !labels.includes(value.toLowerCase())
                                }
                            })}
                            autoComplete="off"
                        />
                            {errors.label && errors.label.type === 'duplicateLabel' && (
                                <div className={`item-explain floating`}>{t('common:errors.duplicate_team_name')}</div>
                            )}
                        </div>
                    </form>
                </OutsideClickHandler>
                :
                <button
                    className={style.title}
                    onClick={() => setEdit(!isEdit)}
                >
                    {label}
                </button>}
            <button
                className={style.delete}
                onClick={() => {
                    deleteHandler(columnIndex)
                }}
            >
                <FiMinusCircle/>
            </button>
        </div>
    )

    function submit(formData: IForm): void {

        const newTeams = [...teams]
        newTeams[columnIndex].title = formData.label
        dispatch(updateProject(activeProject.id, {pool: newTeams[0], teams: newTeams.slice(1)}))

        setEdit(!isEdit)

        reset()
    }

}

export default ColumnTop;