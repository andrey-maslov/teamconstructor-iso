import React from 'react'
import UserProfile from "./user-profile/UserProfile"
import { useSelector } from "react-redux";
import { globalStoreType } from "../../constants/types";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProfilePage: React.FC = () => {
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)
    const { t } = useTranslation()

    if (!isLoggedIn) {
        return <main className="flex-centered text-center main">
            <NavLink to="/signin">{t('common:errors.need_to_authorize')}</NavLink>
        </main>
    }

    return (
        <main className="main">
            <div className="container">
                <div className="row center-xs">
                    <div className="col-xl-8">
                        <UserProfile />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProfilePage
