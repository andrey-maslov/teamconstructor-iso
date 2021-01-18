import React, { useEffect } from 'react'
import Rodal from 'rodal'
import { useDispatch, useSelector } from 'react-redux'
import { globalStoreType, IMemberForm, IModalProps } from '../../../../constants/types'
import { useForm } from 'react-hook-form'
import { SEARCH_MODAL, SET_ERROR } from '../../../../actions/actionTypes'
import SearchMember from "../../forms/search-member/SearchMember";
import { useDisableBodyScroll } from "../../hooks/use-disable-body-scroll";

interface ISearchUserModal extends IModalProps {
    handler: (data: IMemberForm) => void
}

export const SearchUserModal: React.FC<ISearchUserModal> = ({
                                                                visible,
                                                                closeModal,
                                                                isLarge,
                                                                handler
                                                            }) => {

    useDisableBodyScroll(visible)

    useEffect(() => {
        if (!visible) {
            dispatch({ type: SET_ERROR, errorApiMessage: '' })
            reset()
        }
    }, [visible])

    const dispatch = useDispatch()
    const { reset } = useForm()

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
            <SearchMember searchHandler={searchUserHandler} />
        </Rodal>
    )

    function searchUserHandler(data: IMemberForm) {
        handler(data)
        dispatch({ type: SEARCH_MODAL, isSearchModal: false })
    }
}
