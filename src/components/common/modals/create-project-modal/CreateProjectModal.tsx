import React, { useEffect } from 'react'
import Rodal from 'rodal'
import { useDispatch } from 'react-redux'
import { IModalProps } from '../../../../constants/types'
import { useForm } from 'react-hook-form'
import { SET_ERROR } from '../../../../actions/actionTypes'
import CreateProject from '../../team-coop/create-project/CreateProject';
import { useDisableBodyScroll } from "../../hooks/use-disable-body-scroll";

interface IForm {
    name: string
    position: string;
    encData: string;
}

export const CreateProjectModal: React.FC<IModalProps> = ({ visible, closeModal, isLarge }) => {

    useDisableBodyScroll(visible)

    useEffect(() => {
        if (!visible) {
            dispatch({ type: SET_ERROR, errorApiMessage: '' })
            reset()
        }
    }, [visible])

    const dispatch = useDispatch()
    const { reset } = useForm<IForm>()

    const customStyles = {
        height: 'auto',
        bottom: 'auto',
        top: '30%'
    }

    return (
        <Rodal
            className='add-member-modal create-project-modal'
            visible={visible}
            onClose={() => {
                closeModal()
            }}
            width={isLarge ? 400 : 320}
            customStyles={customStyles}
            closeOnEsc={true}
        >
            <CreateProject />
        </Rodal>
    )
}
