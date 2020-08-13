import React, {useEffect} from 'react'
import style from "./auth.module.scss"
import Button from "../buttons/button/Button"
import {useDispatch, useSelector} from "react-redux"
import {GlobalStateType} from "../../../../constants/types"
import {authUser, clearApiError} from "../../../actions/actionCreator"
import {useForm} from 'react-hook-form'

interface IForm {
    identifier: string
    password: string;
}

const Login: React.FC = () => {

    const errorApiMsg = useSelector((state: GlobalStateType) => state.userData.errorMessage)
    const isModalVisible = useSelector((state: GlobalStateType) => state.modalsReducer.isAuthModal)
    const dispatch = useDispatch()
    const {register, handleSubmit, reset, errors} = useForm<IForm>()


    useEffect(() => {
        if (!isModalVisible) {
            dispatch(clearApiError())
            reset()
        }
    }, [isModalVisible])

    return (
        <div className={`${style.content} ${style.login}`}>
            <form onSubmit={handleSubmit(submitForm)}>

                <div className={`form-group`}>
                    <label htmlFor="">
                        <span>Имя или Email</span>
                        <input
                            className={style.input}
                            type="text" name="identifier"
                            onChange={() => dispatch(clearApiError())}
                            ref={register({
                                required: 'Это обязательное поле'
                            })}
                        />
                    </label>
                    {errors.identifier && <div className={`msg-error`}>{errors.identifier.message}</div>}
                </div>
                <div className={`form-group`}>
                    <label htmlFor="">
                        <span>Пароль</span>
                        <input
                            className={style.input}
                            type="password"
                            name="password"
                            ref={register({
                                required: 'Это обязательное поле',
                                minLength: {value: 3, message: 'Слишком короткий пароль'}
                            })}
                            onChange={() => dispatch(clearApiError())}
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
        dispatch(clearApiError())
        reset()
    }

}

export default Login