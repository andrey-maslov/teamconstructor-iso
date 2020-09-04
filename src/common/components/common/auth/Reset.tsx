import React, {useEffect} from 'react'

import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useForm} from 'react-hook-form'
import {AiOutlineLoading} from 'react-icons/ai'
import {useTranslation} from "react-i18next"
import {ILogin} from "./Login"
import {useSelector} from "react-redux";
import ResetSuccess from "./ResetSuccess";

export interface IResetForm {
    password: string
    passwordConfirm: string
}

const Reset: React.FC<ILogin<IResetForm>> = ({isLoading, errorApiMessage, submitHandle, clearApiError}) => {

    const {t} = useTranslation()
    const {register, handleSubmit, reset, getValues, errors} = useForm<IResetForm>()
    const {isPwdChanged} = useSelector((state: any) => state.appReducer)

    if (isPwdChanged) {
        return (
            <ResetSuccess/>
        )
    }

    return (
        <form onSubmit={handleSubmit(submitHandle)}>
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
                    title={t('common:buttons.reset_pwd')}
                    startIcon={isLoading && <AiOutlineLoading/>}
                    handle={() => void (0)}
                    btnClass={'btn-outlined btn-loader'}
                />
                {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
            </div>
        </form>
    )
}

export default Reset