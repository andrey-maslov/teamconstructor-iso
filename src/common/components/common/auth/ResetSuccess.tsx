import React, {useEffect} from 'react'
import {AiOutlineLoading} from 'react-icons/ai'
import {useTranslation} from "react-i18next"
import {NavLink} from "react-router-dom"

const ResetSuccess: React.FC = () => {

    const {t} = useTranslation()


    return (
        <div>
            Reset SUCCESS
        </div>
    );

}

export default ResetSuccess