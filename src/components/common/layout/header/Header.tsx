import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaPredicate } from 'react-media-hook'
import { checkAuth, logOut } from '../../../../actions/actionCreator'
import MobiHeader from '../../../mobi/header/MobiHeader'
import WebHeader from '../../../web/header/WebHeader'
import { FiUsers, FiSettings } from 'react-icons/fi'
import { RiTeamLine } from 'react-icons/ri'
import { globalStoreType, INavRoute } from '../../../../constants/types'
import { useTranslation } from 'react-i18next'
import { confirmAlert } from "react-confirm-alert";
import { checkUserAccess } from "../../../../helper/helper";
import { EXTENDED_ACCESS_LIST } from "../../../../constants/constants";

const Header: React.FC = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { isLoggedIn, email, tariffId } = useSelector((state: globalStoreType) => state.user)

    // const userAccess = isLoggedIn ? 'auth' : 'all'

    const routes: INavRoute[] = [
        { title: t('common:nav.pair'), path: '/pair', access: 'all', icon: <FiUsers /> },
        { title: t('common:nav.team'), path: '/team', access: 'premium', icon: <RiTeamLine /> },
        { title: t('common:nav.profile'), path: '/profile', access: 'auth', icon: <FiSettings /> },
    ]
    const routesToDisplay: INavRoute[] = routes.filter(route => {
        if (isLoggedIn && checkUserAccess(EXTENDED_ACCESS_LIST, tariffId)) {
            return route
        } else if (isLoggedIn) {
            return route.access === 'all' || route.access === 'auth'
        }
        return route.access === 'all'
    })

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
            userEmail={email || ''}
            routes={routesToDisplay}
        />
    }
    return <WebHeader
        isLoggedIn={isLoggedIn}
        handleLogoutBtn={logOutHandle}
        userEmail={email || ''}
        routes={routesToDisplay}
    />

    function logOutHandle() {
        if (isLoggedIn) {
            dispatch(logOut())

            // confirmAlert({
            //     message: t('common:confirm.do_logout'),
            //     buttons: [
            //         { label: 'Остаться', onClick: () => null },
            //         { label: 'Выйти', onClick: () => dispatch(logOut()) }
            //     ],
            //     overlayClassName: "alert-overlay confirm-danger",
            // });
        }
    }
}

export default Header
