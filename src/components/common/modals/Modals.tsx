import React from 'react'
import 'rodal/lib/rodal.css'
import { AddMember } from './add-member/AddMember'
import { useMediaPredicate } from 'react-media-hook'
import { setAddMemberModal, setCreateProjectModal } from '../../../actions/actionCreator'
import { useSelector, useDispatch } from 'react-redux'
import { globalStoreType } from '../../../constants/types'
import { CreateProjectModal } from './create-project-modal/CreateProjectModal'
import { CookiesConsent } from '../popovers/cookies-consent/CookiesConsent'
import { DANGER_MODAL, SET_MEMBER_INFO_MODAL } from '../../../actions/actionTypes'
import { MemberInfo } from './member-info/MemberInfo'
import DangerModal from "./danger-modal/DangerModal";

const Modals: React.FC = () => {

    const dispatch = useDispatch()
    const isMobi = useMediaPredicate('(max-width: 600px)')
    const isLarge = useMediaPredicate('(min-width: 1300px)')
    const {
        isAddMemberModal,
        isCreateProjectModal,
        isMemberInfoModal,
        isDangerModal,i
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
                isLarge={isLarge}
                isMobi={isMobi}
                closeModal={() => {
                    dispatch({ type: SET_MEMBER_INFO_MODAL, isMemberInfoModal: false })
                }}
            />}
            {isCreateProjectModal && <CreateProjectModal
                visible={isCreateProjectModal}
                isLarge={!isMobi}
                closeModal={() => {
                    dispatch(setCreateProjectModal(false))
                }}
            />}

            {isDangerModal && (
                <DangerModal
                    visible={isDangerModal}
                    closeModal={() => {
                        dispatch({ type: DANGER_MODAL, isDangerModal: false })
                    }}
                />
            )}

            <CookiesConsent />
        </>
    )
}

export default Modals
