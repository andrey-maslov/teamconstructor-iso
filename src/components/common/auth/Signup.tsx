import React, {useEffect} from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useForm} from 'react-hook-form'
import {AiOutlineLoading} from 'react-icons/ai'
import {useTranslation} from "react-i18next"
import {ILogin} from "./Login"

export interface ISignUpForm {
    name: string
    email: string
    password: string
    passwordConfirm: string
    errors: any
}

const Signup: React.FC<ILogin<ISignUpForm>> = ({isLoading, errorApiMessage, submitHandle, clearApiError}) => {

    const {t} = useTranslation()
    const {register, handleSubmit, reset, getValues, errors} = useForm<ISignUpForm>()

    return (
        <form onSubmit={handleSubmit(submitHandle)}>

            <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                <label>
                    <span>{t('common:auth.name')}</span>
                    <input
                        className={style.input}
                        type="text"
                        name="name"
                        onFocus={clearApiError}
                        ref={register({
                            required: `${t('common:errors.required')}`
                        })}
                    />
                </label>
                {errors.name && <div className={`item-explain`}>{errors.name.message}</div>}
            </div>

            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label>
                    <span>Email</span>
                    <input
                        className={style.input}
                        name="email"
                        onFocus={clearApiError}
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

            <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label>
                    <span>{t('common:auth.pwd')}</span>
                    <input
                        className={style.input}
                        type="password"
                        name="password"
                        onFocus={clearApiError}
                        ref={register({
                            required: `${t('common:errors.required')}`,
                            minLength: {value: 3, message: `${t('common:errors.short_pwd')}`}
                        })}
                    />
                </label>
                {errors.password && <div className={`item-explain`}>{errors.password.message}</div>}
            </div>

            <div className={`form-group ${errors.passwordConfirm ? 'has-error' : ''}`}>
                <label>
                    <span>{t('common:auth.confirm_pwd')}</span>
                    <input
                        className={style.input}
                        type="password"
                        name="passwordConfirm"
                        onFocus={clearApiError}
                        ref={register({
                            required: `${t('common:errors.confirm_pwd')}`,
                            validate: {
                                matchesPreviousPassword: value => {
                                    const {password} = getValues();
                                    return password === value || `${t('common:errors.pwd_mismatch')}`;
                                }
                            }
                        })}
                    />
                </label>
                {errors.passwordConfirm && <div className={`item-explain`}>{errors.passwordConfirm.message}</div>}
            </div>

            <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                <Button
                    title={t('common:buttons.signup')}
                    startIcon={isLoading && <AiOutlineLoading/>}
                    handle={() => void (0)}
                    btnClass={'btn-outlined btn-loader'}
                />
                {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
            </div>
        </form>
    )
}

export default Signup