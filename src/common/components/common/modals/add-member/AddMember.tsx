import React, {useState} from "react"
import Rodal from "rodal"
import {useSelector, useDispatch} from "react-redux"
import style from "./add-member.module.scss"
import {GlobalStateType, IModalProps, ITeamProfile} from "../../../../../constants/types"
import Button from "../../buttons/button/Button"
import {GrUserAdd} from "react-icons/gr"
import {getAndDecodeData} from "encoded-data-parser"
import {setTeamsData} from "../../../../actions/actionCreator";

export const AddMember: React.FC<IModalProps> = ({visible, closeModal}) => {

    const [state, setState] = useState({isError: false})

    const dispatch = useDispatch()
    const teams: Array<ITeamProfile> = useSelector((state: GlobalStateType) => state.teamCoopReducer.teams)

    return (
        <Rodal
            className='add-member-modal'
            visible={visible}
            onClose={() => {
                closeModal()
            }}
            height={460}
        >
            <div className={style.content}>
                <form action="" onSubmit={submitForm}>
                    <div className={style.group}>
                        <label htmlFor="">
                            <span>Имя</span>
                            <input className={style.input} type="text" name="name" required/>
                        </label>
                    </div>
                    <div className={style.group}>
                        <label htmlFor="">
                            <span>Должность</span>
                            <input className={style.input} type="text" name="position" required/>
                        </label>

                    </div>
                    <div className={style.group}>
                        <label htmlFor="">
                            <span>Результат теста</span>
                            <textarea
                                className={style.input}
                                name="encData"
                                required
                            />
                        </label>
                    </div>
                    <Button
                        title={'Добавить'}
                        startIcon={<GrUserAdd/>}
                        handle={() => void (0)}
                        btnClass={'btn-outlined'}
                    />
                    {state.isError &&
                    <div className={style.error}>Вы допустили ошибку. Возможно, неправильный формат ввода</div>}
                </form>
            </div>
        </Rodal>
    )

    function submitForm(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const name = e.target['name'].value;
        const position = e.target['position'].value;
        const encData = e.target['encData'].value;

        const {data} = getAndDecodeData('', encData)

        if (!data) {
            setState({isError: true})
            return
        }
        setState({isError: false})
        console.log(data)
        updateStaff(name, position, encData, data, teams)
        closeModal()
    }


    function updateStaff(name: string, position: string, encData: string, decData: any, teams: ITeamProfile[]): void {

        const id = `666-${new Date().getTime()}`
        const newMember = {
            id,
            name,
            position,
            encData,
            decData
        }

        const newTeams = [...teams]
        newTeams[0].items.push(newMember)
        dispatch(setTeamsData(newTeams))
    }


};