import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import style from './profile.module.scss'
import { globalStoreType } from '../../../../../constants/types'
import { NavLink, useHistory } from "react-router-dom"
import Loader from "../../../common/loaders/loader/Loader"
import InputTransformer from "../../../common/Inputs/input-transformer/InputTransformer"
import CodeBox from "../../../common/Inputs/code-box/CodeBox"
import { SET_TOAST } from "../../../../actions/actionTypes"

const UserProfile = () => {
    const {
        firstName,
        lastName,
        email,
        position,
        isLoggedIn,
        testResult
    } = useSelector((state: globalStoreType) => state.user)

    const { t } = useTranslation()
    // const { setToast } = useSelector((state: globalStoreType) => state.app)
    const [isReady, setReady] = useState(false)
    const { addToast } = useToasts()
    const dispatch = useDispatch()
    const history = useHistory()
    const encData = testResult

    const [localUser, setLocalUser] = useState({
        firstName,
        lastName,
        email,
        position,
    })

    useEffect(() => {
        if (!isLoggedIn) {
            history.push('/')
        }

        if (email) {
            setReady(true)
        }

        // if (setToast === 1) {
        //     addToast('Изменения приняты', {
        //         appearance: 'success'
        //     })
        // } else if (setToast === 2) {
        //     addToast('Что-то пошло не так', {
        //         appearance: 'error'
        //     })
        // }

        function updateLocalData() {
            setLocalUser({
                firstName,
                lastName,
                email,
                position
            })

            dispatch({ type: SET_TOAST, setToast: 0 })
        }

        updateLocalData()
    }, [
        firstName,
        lastName,
        email,
        position,
        isLoggedIn,
        // setToast,
        addToast,
        dispatch
    ])

    if (!isReady) {
        return <Loader />
    }

    if (!isLoggedIn) {
        return (
            <main className="flex-centered text-center main">
                <NavLink to="/signin">{t('common:errors.need_to_authorize')}</NavLink>
            </main>
        )
    }

    const textFields = [
        {
            label: t('signin:extra.first_name'),
            key: 'firstName',
            value: localUser.firstName,
            defaultValue: t('signin:extra.first_name')
        },
        {
            label: t('signin:extra.last_name'),
            key: 'lastName',
            value: localUser.lastName,
            defaultValue: t('signin:extra.last_name')
        },
        {
            label: t('signin:extra.position'),
            key: 'position',
            value: localUser.position,
            defaultValue: t('signin:extra.position')
        }
    ]

    const testLink = `https://salary.nobugs.today/test/result${encData ? `?encdata=${encData}` : ''}`

    return (
        <div className={style.wrapper}>
            <div className={style.header}>
                <h2 className={style.title}>Account Settings</h2>
                <p>Here you can change your personal data and privacy settings.</p>
                <p>
                    <NavLink to="/terms">
                        More about the terms of use
                    </NavLink>
                    {` or `}
                    <NavLink to="/policies/privacy-policy">
                        read our privacy policy
                    </NavLink>
                </p>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className={`${style.box} ${style.account}`}>
                        <h5 className={style.box_title}>Account</h5>
                        <div className={`${style.box_content}`}>
                            <div className={`${style.list} flex`}>
                                {textFields.map(item => (
                                    <div
                                        className={`${style.item} ${
                                            !item.value ? style.default : ''
                                        }`}
                                        key={item.key}>
                                        <span className={style.label}>{item.label}</span>
                                        <InputTransformer
                                            initValue={item.value || item.defaultValue}
                                            rules={{
                                                pattern: {
                                                    value: /^[^<>!]*$/i,
                                                    message: `${t('common:errors.invalid')}`
                                                }
                                            }}
                                            objectKey={item.key}
                                            handler={updateProfile}
                                            {...{ type: 'text', autoComplete: 'off' }}
                                        />
                                    </div>
                                ))}
                                <div className={style.item} key="email">
                                    <span className={style.label}>Email:</span>
                                    <div className={style.field}>{email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className={`${style.box} ${style.services}`}>
                        <h5 className={style.box_title}>Services</h5>

                        <div>
                            <div className={`${style.item} flex between-xs`}>
                                {encData ? (
                                    <CodeBox content={encData} />
                                ) : (
                                    <NavLink to="/test">Пройдите тест</NavLink>
                                )}
                            </div>

                            <div className={`${style.item} flex between-xs`}>
                                {encData ? (
                                    <NavLink to="/test/result">Перейти к психологическому профилю</NavLink>
                                ) : (
                                    <NavLink to="/test">Пройдите тест</NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${style.box} ${style.danger}`}>
                <h5 className={style.box_title}>Danger zone</h5>
                <div className={`${style.box_content}`}>
                    <div className={`${style.item} ${style.delete}`}>
                        <div>
                            Once you delete your account, it cannot be undone. This is permanent.
                        </div>
                        <button
                            className="btn"
                            onClick={() => {
                                if (
                                    // eslint-disable-next-line no-alert
                                    window.confirm('Вы действительно хотите удалить аккаунт????')
                                ) {
                                    // eslint-disable-next-line no-alert
                                    alert('Зря!')
                                }
                            }}>
                            Delete account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    function updateProfile(formData: {[key: string]: string}) {
        // dispatch(
        //     updateUserData({
        //         firstName,
        //         lastName,
        //         email,
        //         position,
        //         provider,
        //         isLoggedIn,
        //         isPublic,
        //         isLookingForJob,
        //         ...formData
        //     })
        // )
    }

    function toast() {
        addToast('Изменения приняты', {
            appearance: 'success'
        })
    }
}

export default UserProfile
