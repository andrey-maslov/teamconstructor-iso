import React, {useEffect} from 'react'
import 'rodal/lib/rodal.css'
import {AddMember} from "./add-member/AddMember"
import {setAddMemberModal, setAuthModal} from "../../../actions/actionCreator"
import {useSelector, useDispatch} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import AuthModal from "./auth-modal/AuthModal"
import LoaderRequest from "../loaders/loader-request/LoaderRequest";

// import { CookiesConsent } from '../cookies-consent/CookiesConsent'


const Modals: React.FC = () => {

    const dispatch = useDispatch();
    const appMode = useSelector((state: GlobalStateType) => state.appReducer)
    const isLoggedIn = useSelector((state: GlobalStateType) => state.userData.isLoggedIn)
    const modals = useSelector((state: GlobalStateType) => state.modalsReducer)
    const {isLoading} = appMode
    const {isAddMemberModal, isAuthModal} = modals

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(setAuthModal(false))
        }
    },[isLoggedIn])

    return (
        <>

            <AddMember
                visible={isAddMemberModal}
                closeModal={() => {
                    dispatch(setAddMemberModal(false))
                }}
            />

            <AuthModal
                visible={isAuthModal}
                closeModal={() => {
                    dispatch(setAuthModal(false))
                }}
            />

            {/*{isLoading && <LoaderRequest/>}*/}

            {/*<CookiesConsent*/}
            {/*    handleCookies={handleCookiesConsent}*/}
            {/*    isVisible={!isCookiesConsented}*/}
            {/*/>*/}

        </>
    );
};


export default Modals;