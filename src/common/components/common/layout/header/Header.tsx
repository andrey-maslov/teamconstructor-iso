import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaPredicate } from 'react-media-hook'
import {checkAuth, logOut, setAuthModal} from '../../../../actions/actionCreator'
import MobiHeader from '../../../mobi/header/MobiHeader'
import WebHeader from '../../../web/header/WebHeader'
import {FiDollarSign, FiHome} from "react-icons/fi"
import {GlobalStateType} from "../../../../../constants/types"

const Header: React.FC = () => {

    const dispatch = useDispatch()
    const {isLoggedIn, userEmail} = useSelector((state: GlobalStateType) => state.userData)

    const routes = [
        {title: 'Пара', path: '/', access: 'all', icon: <FiHome/>},
        {title: 'Команда', path: '/team', access: 'auth', icon: <FiDollarSign/>},
    ];

    const isTablet = useMediaPredicate('(max-width: 992px)');

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(checkAuth())
        }
    }, [])

    const handleLoginBtn = () => {
        if (isLoggedIn) {
            if(confirm('Вы действительно хотиете выйти?')) {
                dispatch(logOut())
            }
        } else {
            dispatch(setAuthModal(true))
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

export default Header