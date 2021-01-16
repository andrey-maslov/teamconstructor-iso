import React from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import { useForm } from 'react-hook-form'
import { AiOutlineLoading } from 'react-icons/ai'
import { useTranslation } from "react-i18next"
import { ISignin } from "./Login"
import Password from "../Inputs/password/Password"

export interface ISignUpForm {
    email: string
    password: string
    passwordConfirm: string
    form?: unknown
}

const Signup: React.FC<ISignin<ISignUpForm>> = ({ isLoading, errorApiMessage, submitHandle }) => {

    const { t } = useTranslation()
    const { register, handleSubmit, setError, getValues, errors, clearErrors } = useForm<ISignUpForm>()

    return (
        <form onSubmit={ handleSubmit(data => submitHandle(data, setError)) }>
            <div className={ `form-group ${ errors.email ? 'has-error' : '' }` }>
                <label>
                    <span>Email</span>
                    <input
                        className={ style.input }
                        name="email"
                        ref={ register({
                            required: `${ t('common:errors.required') }`,
                            pattern: {
                                value: /^(?!['`])\s*[-+.'\w]+@[-.\w]+\.[-.\w]+\s*$/i,
                                message: `${ t('common:errors.invalid_email') }`
                            }
                        }) }
                    />
                </label>
                { errors.email && <div className="item-explain">{ errors.email.message }</div> }
            </div>

            <div className={ `form-group ${ errors.password ? 'has-error' : '' }` }>
                <Password
                    label={ t('common:auth.pwd') }
                    innerRef={ register({
                        required: `${ t('common:errors.required') }`,
                        minLength: { value: 7, message: `${ t('common:auth.short_pwd') }` }
                    }) }
                    name="password"
                />
                { errors.password && <div className="item-explain">{ errors.password.message }</div> }
            </div>

            <div className={ `form-group ${ errors.passwordConfirm ? 'has-error' : '' }` }>
                <Password
                    label={ t('common:auth.confirm_pwd') }
                    innerRef={ register({
                        required: `${ t('common:auth.confirm_pwd') }`,
                        validate: {
                            matchesPreviousPassword: value => {
                                const { password } = getValues()
                                return password === value || `${ t('common:errors.pwd_mismatch') }`
                            }
                        }
                    }) }
                    name="passwordConfirm"
                />
                { errors.passwordConfirm && (
                    <div className="item-explain">{ errors.passwordConfirm.message }</div>
                ) }
            </div>

            <div className={ `form-group ${ errorApiMessage ? 'has-error' : '' }` }>
                <Button
                    title={ t('common:buttons.signup') }
                    startIcon={ isLoading && <AiOutlineLoading /> }
                    handle={ () => clearErrors() }
                    btnClass="btn btn-accent btn-loader"
                />
                { errors.form && <div className="item-explain api-error">{ errors.form.message }</div> }
            </div>
        </form>
    )
}

export default Signup