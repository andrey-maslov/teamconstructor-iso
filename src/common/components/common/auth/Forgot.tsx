import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useForm} from 'react-hook-form'
import {AiOutlineLoading} from 'react-icons/ai'
import {useTranslation} from "react-i18next"
import {NavLink} from "react-router-dom";
import {useDispatch} from "react-redux";
import {SET_ERROR} from "../../../actions/actionTypes";
import ForgotSuccess from "./ForgotSuccess";

export interface IForgotForm {
    email: string
}

export interface ILogin<T> {
    isLoading: boolean
    errorApiMessage: string
    submitHandle: (data: T) => void
    clearApiError: () => void
}

const Forgot: React.FC<ILogin<IForgotForm>> = ({isLoading, errorApiMessage, submitHandle, clearApiError}) => {

    const {t} = useTranslation()
    const history = useHistory()
    const isEmailSent = useSelector((state: any) => state.appReducer.emailSent)
    const {register, handleSubmit, reset, errors} = useForm<IForgotForm>()

    useEffect(() => {
        isEmailSent && history.push('/login/forgot-password-success')
    },[isEmailSent])

    return (
        <>
            <p>{t('common:auth.forgot_explanation')}</p>
            <form onSubmit={handleSubmit(submitHandle)}>
                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <label>
                        <span>Email</span>
                        <input
                            className={style.input}
                            name="email"
                            onFocus={clearApiError}
                            autoComplete="off"
                            ref={register({
                                required: `${t('common:errors.required')}`,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: `${t('common:errors.invalid_email')}`
                                }
                            })}
                        />
                    </label>
                    {errors.email && <div className={`item-explain`}>{errors.email.message}</div>}
                </div>

                <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                    <Button
                        title={t('common:buttons.send')}
                        startIcon={isLoading && <AiOutlineLoading/>}
                        handle={() => void (0)}
                        btnClass={'btn-outlined btn-loader'}
                    />
                    {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
                </div>
            </form>
        </>
    );

}

export default Forgot