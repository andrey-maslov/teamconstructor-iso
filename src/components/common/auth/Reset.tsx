import React from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai'
import { useTranslation } from "react-i18next"
import { ISignin } from "./Login"
import { useSelector } from "react-redux"
import ResetSuccess from "./ResetSuccess"
import { globalStoreType } from "../../../constants/types";
import Password from "../Inputs/password/Password";

export interface IResetForm {
    password: string
    passwordConfirm: string
    email: string
    form?: unknown
}

const Reset: React.FC<ISignin<IResetForm>> = ({ isLoading, errorApiMessage, submitHandle }) => {

    const { t } = useTranslation()
    const { register, handleSubmit, getValues, errors, setError, clearErrors } = useForm<IResetForm>()
    const { isPwdChanged } = useSelector((state: globalStoreType) => state.app)

    if (isPwdChanged) {
        return (
            <ResetSuccess />
        )
    }

    return (
        <form onSubmit={handleSubmit(data => submitHandle(data, setError))}>
            <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label>
                    <Password
                        label={t('common:auth.new_pwd')}
                        innerRef={register({
                            required: `${t('common:errors.required')}`,
                            minLength: { value: 7, message: `${t('signin:short_pwd')}` }
                        })}
                        name="password"
                        autoComplete="off"
                    />
                </label>
                {errors.password && <div className="item-explain">{errors.password.message}</div>}
            </div>

            <div className={`form-group ${errors.passwordConfirm ? 'has-error' : ''}`}>
                <label>
                    <Password
                        label={t('common:auth.confirm_pwd')}
                        innerRef={register({
                            required: `${t('common:errors.confirm_pwd')}`,
                            validate: {
                                matchesPreviousPassword: value => {
                                    const { password } = getValues()
                                    return password === value || `${t('common:errors.pwd_mismatch')}`
                                }
                            }
                        })}
                        name="passwordConfirm"
                        autoComplete="off"
                    />
                </label>
                {errors.passwordConfirm && (
                    <div className="item-explain">{errors.passwordConfirm.message}</div>
                )}
            </div>

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
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: `${t('common:errors.invalid_email')}`
                            }
                        })}
                    />
                </label>
                {errors.email && <div className="item-explain">{errors.email.message}</div>}
            </div>

            <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                <Button
                    title={t('common:buttons.reset_pwd')}
                    startIcon={isLoading && <AiOutlineLoading />}
                    handle={() => clearErrors()}
                    btnClass="btn btn-outlined btn-loader"
                />
                {errors.form && <div className="item-explain api-error">{errors.form.message}</div>}
            </div>
        </form>
    )
}

export default Reset