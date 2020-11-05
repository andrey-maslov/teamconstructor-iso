import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaPredicate } from 'react-media-hook'
import { checkAuth, logOut } from '../../../../actions/actionCreator'
import MobiHeader from '../../../mobi/header/MobiHeader'
import WebHeader from '../../../web/header/WebHeader'
import { FiUsers, FiSettings } from 'react-icons/fi'
import { RiTeamLine } from 'react-icons/ri'
import { globalStoreType } from '../../../../constants/types'
import { useTranslation } from 'react-i18next'

const Header: React.FC = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { isLoggedIn, email } = useSelector((state: globalStoreType) => state.user)

    const routes = [
        { title: t('common:nav.pair'), path: '/pair', access: 'all', icon: <FiUsers /> },
        { title: t('common:nav.team'), path: '/team', access: 'auth', icon: <RiTeamLine /> },
        { title: t('common:nav.profile'), path: '/profile', access: 'auth', icon: <FiSettings /> },
    ]

    const isTablet = useMediaPredicate('(max-width: 992px)')

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(checkAuth())
        }
    }, [])

    if (isTablet) {
        return <MobiHeader
            isLoggedIn={isLoggedIn}
            handleLogoutBtn={logOutHandle}
            userEmail={email}
            routes={routes}
        />
    }
    return <WebHeader
        isLoggedIn={isLoggedIn}
        handleLogoutBtn={logOutHandle}
        userEmail={email}
        routes={routes}
    />

    function logOutHandle() {
        if (isLoggedIn) {
            if (confirm(t('common:confirm.do_logout'))) {
                dispatch(logOut())
            }
        }
    }
}

export default Header
