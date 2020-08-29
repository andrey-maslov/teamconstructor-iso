import React, {useEffect} from 'react'
import 'rodal/lib/rodal.css'
import {AddMember} from "./add-member/AddMember"
import {setAddMemberModal, setAuthModal, setCreateProjectModal} from "../../../actions/actionCreator"
import {useSelector, useDispatch} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import AuthModal from "./auth-modal/AuthModal"
import LoaderRequest from "../loaders/loader-request/LoaderRequest";
import {CreateProjectModal} from "./create-project-modal/CreateProjectModal";
import {CookiesConsent} from "../popovers/cookies-consent/CookiesConsent";

// import { CookiesConsent } from '../cookies-consent/CookiesConsent'


const Modals: React.FC = () => {

    const dispatch = useDispatch();
    const modals = useSelector((state: GlobalStateType) => state.modalsReducer)
    const {isAddMemberModal, isAuthModal, isCreateProjectModal, isCookiesConsented} = modals

    return (
        <>

            {isAddMemberModal && <AddMember
                visible={isAddMemberModal}
                closeModal={() => {
                    dispatch(setAddMemberModal(false))
                }}
            />}

            {isCreateProjectModal && <CreateProjectModal
                visible={isCreateProjectModal}
                closeModal={() => {
                    dispatch(setCreateProjectModal(false))
                }}
            />}

            {isAuthModal && <AuthModal
                visible={isAuthModal}
                closeModal={() => {
                    dispatch(setAuthModal(false))
                }}
            />}

            <CookiesConsent/>

        </>
    );
};


export default Modals;