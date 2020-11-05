import React, {useEffect, useState} from 'react'
import Auth, {IAuthMode} from "../../components/common/auth/Auth";


const AuthPage: React.FC<IAuthMode> = (props) => {


    return (
        <main className='section main flex-centered'>
                <Auth page={props.page} />
        </main>
    );
};

export default AuthPage;