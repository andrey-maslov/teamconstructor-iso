import React from 'react'
import UserProfile from "./user-profile/UserProfile"

const ProfilePage: React.FC = () => {

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
