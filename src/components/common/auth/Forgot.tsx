import React from 'react'
import { useSelector } from 'react-redux'
import style from './auth.module.scss'
import Button from '../buttons/button/Button'
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { anyType, globalStoreType } from "../../../constants/types"
import ResetSuccess from "./ResetSuccess";
import ForgotSuccess from "./ForgotSuccess";

export interface IForgotForm {
    email: string
    form?: unknown
}

export interface ILogin<T> {
    isLoading: boolean
    errorApiMessage: string
    submitHandle: (data: T, setError: anyType) => void
}

const Forgot: React.FC<ILogin<IForgotForm>> = ({ isLoading, errorApiMessage, submitHandle }) => {

    const { t } = useTranslation()
    const { isEmailSent } = useSelector((state: globalStoreType) => state.app)
    const { register, handleSubmit, errors, setError, clearErrors } = useForm<IForgotForm>()

    if (isEmailSent) {
        return (
            <ForgotSuccess />
        )
    }

    return (
        <>
            <p>{t('common:auth.forgot_explanation')}</p>
            <form onSubmit={handleSubmit(data => submitHandle(data, setError))}>
                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <label>
                        <span>Email</span>
                        <input
                            className={style.input}
                            name="email"
                            autoComplete="off"
                            ref={register({
                                required: `${t('common:errors.required')}`,
                                pattern: {
                                    value: /^(?!['`])\s*[-+.'\w]+@[-.\w]+\.[-.\w]+\s*$/i,
                                    message: `${t('common:errors.invalid_email')}`
                                }
                            })}
                        />
                    </label>
                    {errors.email && <div className="item-explain">{errors.email.message}</div>}
                </div>

                <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                    <Button
                        title={t('common:buttons.send')}
                        startIcon={isLoading && <AiOutlineLoading />}
                        handle={() => clearErrors()}
                        btnClass="btn btn-accent btn-loader"
                    />
                    {errors.form && (
                        <div className="item-explain api-error">{errors.form.message}</div>
                    )}
                </div>
            </form>
        </>
    )
}

export default Forgot
