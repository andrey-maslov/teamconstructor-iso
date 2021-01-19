import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from 'react-router-dom'
import { isBrowser, parseQueryString } from "../../../../../helper/helper"
import { globalStoreType } from "../../../../../constants/types";
import Loader from "../../../loaders/loader/Loader";
import { socialAuth } from "../../../../../actions/api/socialAuthAPI";
import { LINKEDIN_REDIRECT_URI } from "../../../../../constants/constants";

const Linkedin: React.FC = () => {

    const history = useHistory()
    const dispatch = useDispatch()
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)

    useEffect(() => {
        if (isBrowser) {
            const queryString = (window.location.search).replace('?', '');
            const { code, state }: { code: string, state: string } = parseQueryString(queryString);
            if (code && state) {
                dispatch(socialAuth({ authCode: code, redirectUri: LINKEDIN_REDIRECT_URI }, 'linkedin'))
            }
        }
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/');
        }
    }, [isLoggedIn])


    return (
        <section className='section main flex-centered'>
            <Loader />
        </section>

    )
}

export default Linkedin