import React from 'react'
import {connect} from "react-redux"
import {useHistory} from 'react-router-dom'
import {setUserData} from "../../../../../actions/actionCreator"
import {parseQueryString} from "../../../../../helper/helper"

interface LinkedinProps {
    addAuthData: (name: string, email: string) => {}
    redirectUrl: string
}

const Linkedin: React.FC<LinkedinProps> = ({addAuthData, redirectUrl}) => {

    const history = useHistory();
    const queryString = (window.location.search).replace('?', '');
    const userParams: any = parseQueryString(queryString);
    const name = decodeURI(userParams.name).replace('+', ' ')

    // isUserInBase(userParams.email)
    addAuthData(name, userParams.email);
    history.push(redirectUrl);

    return (
        <div>
            linkedin login
        </div>

    )
}

export default connect((state: any) => ({
    redirectUrl: state.applicationMode.redirectUrl,
}), {addAuthData: setUserData})(Linkedin);