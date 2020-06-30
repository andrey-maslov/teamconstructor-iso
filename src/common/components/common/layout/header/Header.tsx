import React from 'react';
import { connect } from 'react-redux';
import { useMediaPredicate } from 'react-media-hook';
import { clearUserData } from '../../../../actions/actionCreator';
import MobiHeader from '../../../mobi/header/MobiHeader';
import WebHeader from '../../../web/header/WebHeader';

type HeaderProps = {
    isLoggedIn: boolean
    setLoginModal: (bool: boolean) => {}
    userEmail: string
    clearUserData: () => {}
}

const Header: React.FC<HeaderProps> = ({isLoggedIn, setLoginModal, userEmail, clearUserData}) => {

    const isTablet = useMediaPredicate('(max-width: 992px)');

    const handleLoginBtn = () => {
        if (isLoggedIn) {
            clearUserData();
        } else {
            console.log('xc')
        }
    };

    if (isTablet) {
        return <MobiHeader
            isLoggedIn={isLoggedIn}
            handleLoginBtn={handleLoginBtn}
            userEmail={userEmail}
        />;
    }
    return <WebHeader
        isLoggedIn={isLoggedIn}
        handleLoginBtn={handleLoginBtn}
        userEmail={userEmail}
    />;

};

interface HeaderState {
    userData: {
        isLoggedIn: boolean
        email: string
    }
}

export default connect((state: HeaderState) => ({
    isLoggedIn: state.userData.isLoggedIn,
    userEmail: state.userData.email,
}), {clearUserData})(Header);