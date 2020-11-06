import React from 'react'
import { FiCheckSquare } from 'react-icons/fi'
import { useTranslation } from "react-i18next"

const ResetSuccess: React.FC = () => {

    const { t } = useTranslation()


    return (
        <div>
            <div className="auth-icon-success">
                <FiCheckSquare />
            </div>
            <p>{t('common:auth.reset_success')}</p>
        </div>
    );

}

export default ResetSuccess