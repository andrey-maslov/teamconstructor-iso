import React from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai'
import { useTranslation } from "react-i18next"
import Password from "../Inputs/password/Password"
import { anyType } from "../../../constants/types"

export interface ISigninForm {
    username: string
    password: string
    form?: unknown
}

export interface ISignin<T> {
    isLoading: boolean
    errorApiMessage: string
    submitHandle: (data: T, setError: anyType) => void
}

const Login: React.FC<ISignin<ISigninForm>> = ({ isLoading, errorApiMessage, submitHandle }) => {

    const { t } = useTranslation()
    const { register, handleSubmit, errors, clearErrors, setError } = useForm<ISigninForm>()

    return (
        <form onSubmit={handleSubmit(data => submitHandle(data, setError))}>
            <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
                <label>
                    <span>Email</span>
                    <input
                        className={style.input}
                        name="username"
                        ref={register({
                            required: `${t('common:errors.required')}`,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: `${t('common:errors.invalid_email')}`
                            }
                        })}
                    />
                </label>
                {errors.username && <div className="item-explain">{errors.username.message}</div>}
            </div>
            <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <Password
                    label={t('common:auth.pwd')}
                    innerRef={register({
                        required: `${t('common:errors.required')}`
                    })}
                    name="password"
                />
                {errors.password && <div className="item-explain">{errors.password.message}</div>}
            </div>

            <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                <Button
                    title={t('common:buttons.login')}
                    startIcon={isLoading && <AiOutlineLoading />}
                    handle={() => clearErrors()}
                    btnClass="btn btn-accent btn-loader"
                />
                {errors.form && <div className="item-explain api-error">{errors.form.message}</div>}
            </div>
        </form>
    )
}

export default Login