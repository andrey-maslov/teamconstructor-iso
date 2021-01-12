import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import style from './confirm.module.scss'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { getQueryFromURL, isBrowser } from "../../helper/helper";
import { globalStoreType } from "../../constants/types";
import { sendEmailConfirmation } from "../../actions/api/accountAPI";

const ConfirmEmail: React.FC = () => {

    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { isEmailConfirmed, isLoading, accountApiErrorMsg, apiErrorMsg } = useSelector(
        (state: globalStoreType) => state.app
    )
    useEffect(() => {
        if (isBrowser) {
            const query = window.location.search
            const userId = getQueryFromURL(query, 'userId')
            const code = getQueryFromURL(query, 'code')
            const email = getQueryFromURL(query, 'email')
            if (userId && code && email) {
                dispatch(sendEmailConfirmation({ userId, code, email }))
            } else if (userId && code && !email) {
                dispatch(sendEmailConfirmation({ userId, code }))
            }
        }
    }, [dispatch])

    // useEffect(() => {
    //     if (isEmailConfirmed) {
    //         router.push('/profile')
    //     }
    // }, [isEmailConfirmed, router])

    return (
        <main className='section main flex-centered'>
            <section className="section text-center">
                {isLoading && <span>loading...</span>}
                {isEmailConfirmed && (
                    <div className="success">
                        <div className={style.icon}>
                            <FiCheckCircle />
                        </div>
                        <div className={style.desc}>{t('profile:email_confirm_success')}</div>
                    </div>
                )}
                {apiErrorMsg && (
                    <div className="danger">
                        <div className={style.icon}>
                            <FiAlertCircle />
                        </div>
                        <div className={style.desc}>{apiErrorMsg}</div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default ConfirmEmail;
