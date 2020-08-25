import React, {useEffect} from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useDispatch, useSelector} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import {authUser} from "../../../actions/actionCreator"
import {useForm} from 'react-hook-form'
import {SET_ERROR} from "../../../actions/actionTypes"
import {AiOutlineLoading} from 'react-icons/ai'

interface IForm {
    name: string
    email: string
    password: string
    passwordConfirm: string
    errors: any
}

const Register: React.FC = () => {

    const appMode = useSelector((state: GlobalStateType) => state.appReducer)
    const dispatch = useDispatch()
    const {register, handleSubmit, reset, getValues, errors} = useForm<IForm>()
    const {isLoading, errorApiMsg} = appMode

    useEffect(() => {
        return function clearAll() {
            reset()
            dispatch({type: SET_ERROR, errorMessage: ''})
        }
    }, [])

    return (
        <div>
            <div className={style.content}>
                <form onSubmit={handleSubmit(submitForm)}>

                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                        <label>
                            <span>Имя</span>
                            <input
                                className={style.input}
                                type="text"
                                name="name"
                                onFocus={() => dispatch({type: SET_ERROR, errorMessage: ''})}
                                ref={register({
                                    required: 'Это обязательное поле'
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
                                onFocus={() => dispatch({type: SET_ERROR, errorMessage: ''})}
                                ref={register({
                                    required: 'Это обязательное поле',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "email должен содержать @"
                                    }
                                })}
                            />
                        </label>
                        {errors.email && <div className={`item-explain`}>{errors.email.message}</div>}
                    </div>

                    <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                        <label>
                            <span>Пароль</span>
                            <input
                                className={style.input}
                                type="password"
                                name="password"
                                onFocus={() => dispatch({type: SET_ERROR, errorMessage: ''})}
                                ref={register({
                                    required: 'Это обязательное поле',
                                    minLength: {value: 3, message: 'Слишком короткий пароль'}
                                })}
                            />
                        </label>
                        {errors.password && <div className={`item-explain`}>{errors.password.message}</div>}
                    </div>

                    <div className={`form-group ${errors.passwordConfirm ? 'has-error' : ''}`}>
                        <label>
                            <span>Повторите пароль</span>
                            <input
                                className={style.input}
                                type="password"
                                name="passwordConfirm"
                                onFocus={() => dispatch({type: SET_ERROR, errorMessage: ''})}
                                ref={register({
                                    required: "Пожалуйста, подтвердите пароль!",
                                    validate: {
                                        matchesPreviousPassword: value => {
                                            const {password} = getValues();
                                            return password === value || "Пароли не совпадают!";
                                        }
                                    }
                                })}
                            />
                        </label>
                        {errors.passwordConfirm && <div className={`item-explain`}>{errors.passwordConfirm.message}</div>}
                    </div>

                    <div className={`form-group ${errorApiMsg ? 'has-error' : ''}`}>
                        <Button
                            title={'Зарегистрироваться'}
                            startIcon={isLoading && <AiOutlineLoading/>}
                            handle={() => void (0)}
                            btnClass={'btn-outlined btn-loader'}
                        />
                        {errorApiMsg && <div className={`item-explain`}>{errorApiMsg}</div>}
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