import React from 'react';
import 'rodal/lib/rodal.css';
import {AddMember} from "./add-member/AddMember";
import {setAddMemberModal} from "../../../actions/actionCreator";
import {useSelector, useDispatch} from "react-redux"
import {GlobalStateType} from "../../../../constants/types";

// import { CookiesConsent } from '../cookies-consent/CookiesConsent';


const Modals: React.FC = () => {

    const dispatch = useDispatch();
    const isAddMemberModal = useSelector((state: GlobalStateType) => state.modalsReducer.isAddMemberModal)

    return (
        <>

            <AddMember
                visible={isAddMemberModal}
                closeModal={()=>{dispatch(setAddMemberModal(false))}}
            />

            {/*<CookiesConsent*/}
            {/*    handleCookies={handleCookiesConsent}*/}
            {/*    isVisible={!isCookiesConsented}*/}
            {/*/>*/}

        </>
    );
};


export default Modals;