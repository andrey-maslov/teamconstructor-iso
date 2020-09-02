import React, {useEffect} from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useDispatch, useSelector} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import {authUser} from "../../../actions/actionCreator"
import {useForm} from 'react-hook-form'
import {SET_ERROR} from "../../../actions/actionTypes"
import {AiOutlineLoading} from 'react-icons/ai'
import {useTranslation} from "react-i18next";

interface IForm {
    name: string
    email: string
    password: string
    passwordConfirm: string
    errors: any
}

const Register: React.FC = () => {

    const {t} = useTranslation()
    const dispatch = useDispatch()
    const {register, handleSubmit, reset, getValues, errors} = useForm<IForm>()
    const {isLoading, errorApiMessage} = useSelector((state: GlobalStateType) => state.appReducer)

    useEffect(() => {
        return function clearAll() {
            reset()
            dispatch({type: SET_ERROR, errorApiMessage: ''})
        }
    }, [])

    return (
        <div>
            <div className={style.content}>
                <form onSubmit={handleSubmit(submitForm)}>

                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                        <label>
                            <span>{t('common:auth.name')}</span>
                            <input
                                className={style.input}
                                type="text"
                                name="name"
                                onFocus={() => dispatch({type: SET_ERROR, errorApiMessage: ''})}
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
                                onFocus={() => dispatch({type: SET_ERROR, errorApiMessage: ''})}
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
                                onFocus={() => dispatch({type: SET_ERROR, errorApiMessage: ''})}
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
                            <span>{t('common:confirm.pwd')}</span>
                            <input
                                className={style.input}
                                type="password"
                                name="passwordConfirm"
                                onFocus={() => dispatch({type: SET_ERROR, errorApiMessage: ''})}
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
                            title={t('common:buttons.register')}
                            startIcon={isLoading && <AiOutlineLoading/>}
                            handle={() => void (0)}
                            btnClass={'btn-outlined btn-loader'}
                        />
                        {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
                    </div>
                </form>
            </div>
        </div>
    )

    function submitForm(data: IForm): void {

        console.log('register front OK')

        const userData = {
            username: data.name,
            email: data.email,
            password: data.password,
        }

        dispatch(authUser(userData, 'register'))
    }

}

export default Register