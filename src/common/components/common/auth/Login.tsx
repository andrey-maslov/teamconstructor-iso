import React from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useForm} from 'react-hook-form'
import {AiOutlineLoading} from 'react-icons/ai'
import {useTranslation} from "react-i18next"

export interface ILoginForm {
    identifier: string
    password: string
}

export interface ILogin<T> {
    isLoading: boolean
    errorApiMessage: string
    submitHandle: (data: T) => void
    clearApiError: () => void
}

const Login: React.FC<ILogin<ILoginForm>> = ({isLoading, errorApiMessage, submitHandle, clearApiError}) => {

    const {t} = useTranslation()
    const {register, handleSubmit, errors} = useForm<ILoginForm>()

    return (
        <form onSubmit={handleSubmit(submitHandle)}>

            <div className={`form-group ${errors.identifier ? 'has-error' : ''}`}>
                <label>
                    <span>{t('common:auth.identifier')}</span>
                    <input
                        className={style.input}
                        type="text"
                        name="identifier"
                        onFocus={clearApiError}
                        ref={register({
                            required: `${t('common:errors.required')}`
                        })}
                    />
                </label>
                {errors.identifier && <div className={`item-explain`}>{errors.identifier.message}</div>}
            </div>
            <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label>
                    <span>{t('common:auth.pwd')}</span>
                    <input
                        className={style.input}
                        type="password"
                        name="password"
                        ref={register({
                            required: `${t('common:errors.required')}`,
                        })}
                        onFocus={clearApiError}
                    />
                </label>
                {errors.password && <div className={`item-explain`}>{errors.password.message}</div>}
            </div>

            <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                <Button
                    title={t('common:buttons.login')}
                    startIcon={isLoading && <AiOutlineLoading/>}
                    handle={() => void (0)}
                    btnClass={'btn-outlined btn-loader'}
                />
                {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
            </div>
        </form>
    )
}

export default Login