import React from 'react'
import {useTranslation} from "react-i18next"
import {FiCheckSquare} from "react-icons/fi";

const ForgotSuccess: React.FC = () => {

    const {t} = useTranslation()


    return (
        <div>
            <div className="auth-icon-success">
                <FiCheckSquare/>
            </div>
            <p>{t('common:auth.forgot_success')}</p>
        </div>
    );

}

export default ForgotSuccess