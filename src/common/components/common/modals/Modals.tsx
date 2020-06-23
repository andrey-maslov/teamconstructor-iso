import { setCookiesConsent, setOnlyLoggedModal, setStatusModal } from '../../../actions/actionCreator';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
// import { CookiesConsent } from '../cookies-consent/CookiesConsent';

interface ModalsProps {
    isOnlyLoggedModal: boolean
    isStatusModal: boolean
    isCookiesConsented: boolean
    setOnlyLoggedModal: (bool: boolean) => {}
    setLoginModal: (bool: boolean) => {}
    setStatusModal: (bool: boolean) => {}
    setCookiesConsent: (bool: boolean) => {}
}

const Modals: React.FC<ModalsProps> = (props) => {

    const {
        isOnlyLoggedModal,
        isStatusModal,
        isCookiesConsented,
        setOnlyLoggedModal,
        setStatusModal,
        setCookiesConsent
    } = props;

    const [isModalShown, setModalState] = useState<{ visible: boolean }>({visible: false});

    const showModal = () => {
        setModalState({visible: true});
    };

    const hideModal = () => {
        setModalState({visible: false});
    };

    const handleCookiesConsent = () => {
        setCookiesConsent(true);
    };


    return (
        <>
            {/*<CookiesConsent*/}
            {/*    handleCookies={handleCookiesConsent}*/}
            {/*    isVisible={!isCookiesConsented}*/}
            {/*/>*/}

            <Rodal visible={isModalShown.visible} onClose={hideModal}>
                <div>Common modals</div>
            </Rodal>
        </>
    );
};

interface ModalsState {
    modalsReducer: {
        isOnlyLoggedModal: boolean
        isStatusModal: boolean
    }
    userData: {
        isCookiesConsented: boolean
    }
}

export default connect((state: ModalsState) => ({
    isOnlyLoggedModal: state.modalsReducer.isOnlyLoggedModal,
    isStatusModal: state.modalsReducer.isStatusModal,
    isCookiesConsented: state.userData.isCookiesConsented,
}), {setOnlyLoggedModal, setStatusModal, setCookiesConsent})(Modals);