import React from 'react'
import { FaLinkedinIn } from 'react-icons/fa'
import Button from '../../../buttons/button/Button'

export const LinkedinLogin: React.FC<{ isEnabled: boolean }> = ({ isEnabled }) => {

    const url = 'https://www.linkedin.com/oauth/v2/authorization'
    const redirect = process.env.RAZZLE_LINKEDIN_REDIRECT || ''
    const scope = process.env.RAZZLE_LINKEDIN_SCOPE
    const cId = process.env.RAZZLE_LINKEDIN_CLIENT_ID

    const linkedinRedirect = `${url}?response_type=code&client_id=${cId}&redirect_uri=${encodeURIComponent(redirect)}&state=fooobar&scope=${scope}`

    const onClick = () => {
        window.location.href = linkedinRedirect
    }
    
    return (
        <Button
            handle={onClick}
            btnClass="btn btn-linkedin"
            title=""
            startIcon={<FaLinkedinIn />}
            isEnabled={isEnabled}
        />
    )
}
