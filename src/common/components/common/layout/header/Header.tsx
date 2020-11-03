import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaPredicate } from 'react-media-hook'
import { checkAuth, fetchProject, logOut } from '../../../../actions/actionCreator'
import MobiHeader from '../../../mobi/header/MobiHeader'
import WebHeader from '../../../web/header/WebHeader'
import { FiDollarSign, FiHome } from 'react-icons/fi'
import { globalStoreType } from '../../../../../constants/types'
import { useTranslation } from 'react-i18next'

const Header: React.FC = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { isLoggedIn, userEmail, activeProject } = useSelector((state: globalStoreType) => state.user)

    const routes = [
        { title: t('common:nav.pair'), path: '/pair', access: 'all', icon: <FiHome /> },
        { title: t('common:nav.team'), path: '/team', access: 'auth', icon: <FiDollarSign /> },
        { title: t('common:nav.profile'), path: '/profile', access: 'auth', icon: <FiDollarSign /> },
    ]

    const isTablet = useMediaPredicate('(max-width: 992px)')

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(checkAuth())
        }
        if (activeProject) {
            setProject(activeProject.id)
        }
    }, [])

    const handleLoginBtn = () => {
        if (isLoggedIn) {
            if (confirm(t('common:confirm.do_logout'))) {
                dispatch(logOut())
            }
        }
    }

    if (isTablet) {
        return <MobiHeader
            isLoggedIn={isLoggedIn}
            handleLoginBtn={handleLoginBtn}
            setProject={setProject}
            userEmail={userEmail}
            routes={routes}
        />
    }
    return <WebHeader
        isLoggedIn={isLoggedIn}
        handleLoginBtn={handleLoginBtn}
        setProject={setProject}
        userEmail={userEmail}
        routes={routes}
    />

    function setProject(id: number) {
        dispatch(fetchProject(id))
    }

}

export default Header
