import React from 'react';
import { connect } from 'react-redux';
import { useMediaPredicate } from 'react-media-hook';
import { clearUserData } from '../../../../actions/actionCreator';
import MobiHeader from '../../../mobi/header/MobiHeader';
import WebHeader from '../../../web/header/WebHeader';
import {FiDollarSign, FiHome} from "react-icons/fi";

type HeaderProps = {
    isLoggedIn: boolean
    setLoginModal: (bool: boolean) => void
    userEmail: string
    clearUserData: () => void
}

//TODO change to Redux hooks
const Header: React.FC<HeaderProps> = ({isLoggedIn, setLoginModal, userEmail, clearUserData}) => {

    const routes = [
        {title: 'Пара', path: '/', access: 'all', icon: <FiHome/>},
        {title: 'Команда', path: '/team', access: 'auth', icon: <FiDollarSign/>},
    ];

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
            routes={routes}
        />;
    }
    return <WebHeader
        isLoggedIn={isLoggedIn}
        handleLoginBtn={handleLoginBtn}
        userEmail={userEmail}
        routes={routes}
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