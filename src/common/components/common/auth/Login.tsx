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
    identifier: string
    password: string
}

const Login: React.FC = () => {

    const {isLoading, errorApiMessage} = useSelector((state: GlobalStateType) => state.appReducer)
    const dispatch = useDispatch()
    const {register, handleSubmit, reset, errors} = useForm<IForm>()


    useEffect(() => {
        return function clearAll() {
            reset()
            dispatch({type: SET_ERROR, errorApiMessage: ''})
        }
    }, [])

    return (
        <div className={`${style.content} ${style.login}`}>
            <form onSubmit={handleSubmit(submitForm)}>

                <div className={`form-group ${errors.identifier ? 'has-error' : ''}`}>
                    <label>
                        <span>Имя или Email</span>
                        <input
                            className={style.input}
                            type="text"
                            name="identifier"
                            onFocus={() => dispatch({type: SET_ERROR, errorApiMessage: ''})}
                            ref={register({
                                required: 'Это обязательное поле'
                            })}
                        />
                    </label>
                    {errors.identifier && <div className={`item-explain`}>{errors.identifier.message}</div>}
                </div>
                <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                    <label>
                        <span>Пароль</span>
                        <input
                            className={style.input}
                            type="password"
                            name="password"
                            ref={register({
                                required: 'Это обязательное поле',
                            })}
                            onFocus={() => dispatch({type: SET_ERROR, errorApiMessage: ''})}
                        />
                    </label>
                    {errors.password && <div className={`item-explain`}>{errors.password.message}</div>}
                </div>

                <div className={`form-group ${errorApiMessage ? 'has-error' : ''}`}>
                    <Button
                        title={'Войти'}
                        startIcon={isLoading && <AiOutlineLoading/>}
                        handle={() => void (0)}
                        btnClass={'btn-outlined btn-loader'}
                    />
                    {errorApiMessage && <div className={`item-explain`}>{errorApiMessage}</div>}
                </div>
            </form>
        </div>
    );

    function submitForm(data: IForm): void {
        dispatch(authUser(data, 'login'))
    }

    function forgotHandle() {
        console.log('forgot')
    }

}

export default Login