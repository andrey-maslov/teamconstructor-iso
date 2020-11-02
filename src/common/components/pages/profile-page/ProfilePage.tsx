import React from 'react'
import UserProfile from "./user-profile/UserProfile"

const ProfilePage: React.FC = () => {

    return (
        <main className="main">
            <div className="container">
                <UserProfile />
            </div>
        </main>
    )
}

export default ProfilePage
