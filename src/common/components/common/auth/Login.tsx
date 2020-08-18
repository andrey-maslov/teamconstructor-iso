import React, {useEffect} from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useDispatch, useSelector} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import {authUser} from "../../../actions/actionCreator"
import {useForm} from 'react-hook-form'
import {SET_ERROR} from "../../../actions/actionTypes"

interface IForm {
    identifier: string
    password: string
}

const Login: React.FC = () => {

    const errorApiMsg = useSelector((state: GlobalStateType) => state.appReducer.errorMessage)
    const isModalVisible = useSelector((state: GlobalStateType) => state.modalsReducer.isAuthModal)
    const dispatch = useDispatch()
    const {register, handleSubmit, reset, errors} = useForm<IForm>()


    useEffect(() => {
        if (!isModalVisible) {
            dispatch({type: SET_ERROR, errorMessage: ''})
            reset()
        }
    }, [isModalVisible])

    return (
        <div className={`${style.content} ${style.login}`}>
            <form onSubmit={handleSubmit(submitForm)}>

                <div className={`form-group`}>
                    <label>
                        <span>Имя или Email</span>
                        <input
                            className={style.input}
                            type="text"
                            name="identifier"
                            onFocus={() => dispatch({type: SET_ERROR, errorMessage: ''})}
                            ref={register({
                                required: 'Это обязательное поле'
                            })}
                        />
                    </label>
                    {errors.identifier && <div className={`msg-error`}>{errors.identifier.message}</div>}
                </div>
                <div className={`form-group`}>
                    <label>
                        <span>Пароль</span>
                        <input
                            className={style.input}
                            type="password"
                            name="password"
                            ref={register({
                                required: 'Это обязательное поле',
                                minLength: {value: 3, message: 'Слишком короткий пароль'}
                            })}
                            onFocus={() => dispatch({type: SET_ERROR, errorMessage: ''})}
                        />
                    </label>
                    {errors.password && <div className={`msg-error`}>{errors.password.message}</div>}
                </div>

                <Button
                    title={'Войти'}
                    startIcon={null}
                    handle={() => void (0)}
                    btnClass={'btn-outlined'}
                />
                {errorApiMsg && <div className={`msg-error`}>{errorApiMsg}</div>}
            </form>
        </div>
    );

    function submitForm(data: IForm): void {
        dispatch(authUser(data, 'login'))
        // dispatch({type: SET_ERROR, errorMessage: ''})
    }

}

export default Login