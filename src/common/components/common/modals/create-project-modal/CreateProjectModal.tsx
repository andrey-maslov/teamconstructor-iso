import React, {useEffect} from "react"
import Rodal from "rodal"
import {useDispatch} from "react-redux"
import style from "./create.module.scss"
import {IModalProps} from "../../../../../constants/types"
import {useForm} from 'react-hook-form'
import {SET_ERROR} from "../../../../actions/actionTypes";
import CreateProject from "../../team-coop/create-project/CreateProject";

interface IForm {
    name: string
    position: string;
    encData: string;
}

export const CreateProjectModal: React.FC<IModalProps> = ({visible, closeModal}) => {

    useEffect(() => {
        if (!visible) {
            dispatch({type: SET_ERROR, errorApiMessage: ''})
            reset()
        }
    }, [visible])

    const dispatch = useDispatch()
    const {reset} = useForm<IForm>()

    return (
        <Rodal
            className='add-member-modal create-project-modal'
            visible={visible}
            onClose={() => {
                closeModal()
            }}
            height={220}
        >
            <CreateProject />
        </Rodal>
    )
}