import React from 'react'
import 'rodal/lib/rodal.css'
import { AddMember } from './add-member/AddMember'
import { setAddMemberModal, setCreateProjectModal } from '../../../actions/actionCreator'
import { useSelector, useDispatch } from 'react-redux'
import { globalStoreType } from '../../../../constants/types'
import { CreateProjectModal } from './create-project-modal/CreateProjectModal'
import { CookiesConsent } from '../popovers/cookies-consent/CookiesConsent'
import { SET_MEMBER_INFO_MODAL } from "../../../actions/actionTypes";
import { MemberInfo } from "./member-info/MemberInfo";

const Modals: React.FC = () => {

    const dispatch = useDispatch()
    const {
        isAddMemberModal,
        isCreateProjectModal,
        isMemberInfoModal
    } = useSelector((state: globalStoreType) => state.modals)

    return (
        <>

            {isAddMemberModal && <AddMember
                visible={isAddMemberModal}
                closeModal={() => {
                    dispatch(setAddMemberModal(false))
                }}
            />}

            {isMemberInfoModal && <MemberInfo
                visible={isMemberInfoModal}
                closeModal={() => {
                    dispatch({type: SET_MEMBER_INFO_MODAL, isMemberInfoModal: false})
                }}
            />}

            {isCreateProjectModal && <CreateProjectModal
                visible={isCreateProjectModal}
                closeModal={() => {
                    dispatch(setCreateProjectModal(false))
                }}
            />}
            <CookiesConsent />
        </>
    )
}

export default Modals
