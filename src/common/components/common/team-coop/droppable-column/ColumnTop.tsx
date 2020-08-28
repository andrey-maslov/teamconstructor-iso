import React, {useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {FiMinusCircle} from "react-icons/fi"
import {useForm} from 'react-hook-form'

import style from './droppable-column.module.scss'
import OutsideClickHandler from 'react-outside-click-handler'
import {GlobalStateType, ITeam} from "../../../../../constants/types";
import {setTeamsData, updateProject} from "../../../../actions/actionCreator";

interface IForm {
    label: string
}

interface ColumnTop {
    label: string
    deleteHandler: (colIndex: number) => void
    columnIndex: number
}

const ColumnTop: React.FC<ColumnTop> = ({deleteHandler, label, columnIndex}) => {

    const [state, setState] = useState({
        isEdit: false,
    })
    const teams: ITeam[] = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)
    const {activeProject} = useSelector((state: GlobalStateType) => state.userData)
    const dispatch = useDispatch()
    const {register, handleSubmit, errors, reset} = useForm<IForm>()
    const labels: string[] = teams.length > 1 ? teams.map(team => team.title.toLowerCase()) : []
    // labels.shift()

    return (
        <div className={style.top}>
            {state.isEdit ?
                <OutsideClickHandler
                    onOutsideClick={() => setState({...state, isEdit: !state.isEdit})}
                >
                    <form onSubmit={handleSubmit(submit)}>
                        <div className={`form-group ${errors.label ? 'has-error' : ''}`}>
                            <input
                            type="text"
                            name="label"
                            defaultValue={label}
                            className={style.titleInput}
                            onFocus={(e: any) => e.target.select()}
                            autoFocus={true}
                            ref={register({
                                required: 'Это обязательное поле',
                                validate: {
                                    duplicateLabel: value => !labels.includes(value.toLowerCase())
                                }
                            })}
                            autoComplete="off"
                        />
                            {errors.label && errors.label.type === 'duplicateLabel' && (
                                <div className={`item-explain`}>Команда с таком названием уже есть</div>
                            )}
                        </div>
                    </form>
                </OutsideClickHandler>
                :
                <button
                    className={style.title}
                    onClick={() => setState({...state, isEdit: !state.isEdit})}
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

        setState({...state, isEdit: !state.isEdit})

        reset()
    }

}

export default ColumnTop;