import React, {useEffect} from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useDispatch, useSelector} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import {authUser} from "../../../actions/actionCreator"
import {useForm} from 'react-hook-form'
import {SET_ERROR} from "../../../actions/actionTypes";

interface IForm {
    name: string
    email: string
    password: string
    passwordConfirm: string
}

const Register: React.FC = () => {

    const errorApiMsg = useSelector((state: GlobalStateType) => state.appReducer.errorMessage)
    const isModalVisible = useSelector((state: GlobalStateType) => state.modalsReducer.isAuthModal)
    const dispatch = useDispatch()
    const {register, handleSubmit, reset, getValues, errors} = useForm<IForm>()

    useEffect(() => {
        if (!isModalVisible) {
            dispatch({type: SET_ERROR, errorMessage: ''})
            reset()
        }
    }, [isModalVisible])

    return (
        <div>
            <div className={style.content}>
                <form onSubmit={handleSubmit(submitForm)}>

                    <div className={`form-group`}>
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
                        {errors.name && <div className={`msg-error`}>{errors.name.message}</div>}
                    </div>

                    <div className={`form-group`}>
                        <label>
                            <span>Email</span>
                            <input
                                className={style.input}
                                type="email"
                                name="email"
                                onFocus={() => dispatch({type: SET_ERROR, errorMessage: ''})}
                                ref={register({
                                    required: 'Это обязательное поле'
                                })}
                            />
                        </label>
                        {errors.email && <div className={`msg-error`}>{errors.email.message}</div>}
                    </div>

                    <div className={`form-group`}>
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
                        {errors.password && <div className={`msg-error`}>{errors.password.message}</div>}
                    </div>

                    <div className={`form-group`}>
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
                        {errors.passwordConfirm && <div className={`msg-error`}>{errors.passwordConfirm.message}</div>}
                    </div>

                    <Button
                        title={'Зарегистрироваться'}
                        startIcon={null}
                        handle={() => void (0)}
                        btnClass={'btn-outlined'}
                    />
                    {errorApiMsg && <div className={`msg-error`}>{errorApiMsg}</div>}
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