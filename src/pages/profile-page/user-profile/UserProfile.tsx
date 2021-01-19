import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import style from './profile.module.scss'
import { globalStoreType, IOneFieldForm, ITariff } from '../../../constants/types'
import { NavLink } from 'react-router-dom'
import Loader from '../../../components/common/loaders/loader/Loader'
import { useForm } from 'react-hook-form'
import InputTransformer from '../../../components/common/Inputs/input-transformer/InputTransformer'
import CodeBox from '../../../components/common/Inputs/code-box/CodeBox'
import { DANGER_MODAL, SET_TOAST } from '../../../actions/actionTypes'
import { changeEmail, updateUserData } from "../../../actions/api/accountAPI"
import { SERVICE, TEST_URL } from "../../../constants/constants";
import { fetchUsersBillingData } from "../../../actions/api/subscriptionsAPI";
import { fetchTariffsData } from "../../../actions/api/tariffsAPI";

const UserProfile = () => {
    const {
        firstName,
        lastName,
        email,
        emailConfirmed,
        position,
        isLoggedIn,
        psyData: encData
    } = useSelector((state: globalStoreType) => state.user)

    const { t, i18n } = useTranslation()
    const { isEmailSent } = useSelector((state: globalStoreType) => state.app)
    const [isReady, setReady] = useState(false)
    const { addToast } = useToasts()
    const dispatch = useDispatch()
    const { register, handleSubmit, errors, reset } = useForm<IOneFieldForm<string>>()
    const [tariffList, setTariffList] = useState([])

    const [localUser, setLocalUser] = useState({
        firstName,
        lastName,
        email,
        position,
    })

    const lng = i18n.language.toUpperCase()

    useEffect(() => {
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
        addToast,
        dispatch
    ])

    // Get current user subscriptions
    useEffect(() => {
        fetchUsersBillingData().then((data) => {
            if (Array.isArray(data)) {
                const list = data.filter((item: any) => item?.membershipPlan?.service === SERVICE)
                console.log('billing', list)
            } else {
                console.log('Error: ', data)
            }
        })
    }, [])

    // Get all services tariffs and filter teamconstructor tariffs
    useEffect(() => {
        fetchTariffsData().then((data: ITariff[] | number) => {
            if (Array.isArray(data)) {
                const list = data.filter((item: any) => item?.service === SERVICE)
                console.log('billing', list)
            } else {
                console.log('Error: ', data)
            }
        })
    }, [])

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
            label: t('common:profile.first_name'),
            key: 'firstName',
            value: localUser.firstName,
            defaultValue: t('common:profile.first_name')
        },
        {
            label: t('common:profile.last_name'),
            key: 'lastName',
            value: localUser.lastName,
            defaultValue: t('common:profile.last_name')
        },
        {
            label: t('common:profile.position'),
            key: 'position',
            value: localUser.position,
            defaultValue: t('common:profile.position')
        }
    ]
    const emailField = {
        label: 'Email',
        key: 'email',
        value: localUser.email,
        defaultValue: 'email'
    }

    const testResultLink = `${TEST_URL}/result?lng=${lng}${encData ? `&encdata=${encData}` : ''}`

    return (
        <div className={style.wrapper}>

            <div className={`${style.header} ${style.box}`}>
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

            <div className={`${style.box} ${style.account}`}>
                <h5 className={style.box_title}>Account
                    {!emailConfirmed && <span className="color-red"> Email needs confirmation</span>}
                </h5>
                <div className={`${style.box_content}`}>
                    <div className={style.list}>
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
                        <div
                            className={`${style.item} ${
                                !emailField.value ? style.default : ''
                            } ${isEmailSent ? 'has-success' : ''}`}>
                            <span className={style.label}>{emailField.label}</span>
                            <InputTransformer
                                initValue={emailField.value || emailField.defaultValue}
                                rules={{
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: `${t('common:errors.invalid_email')}`
                                    }
                                }}
                                objectKey={emailField.key}
                                handler={changeUserEmail}
                                {...{ type: 'text', autoComplete: 'off' }}
                            />
                            {isEmailSent && (
                                <small className="success">
                                    {t('common:profile.email_send_success')}
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${style.box} ${style.services}`}>
                <h5 className={style.box_title}>Psychological Profile</h5>
                <div className={`${style.box_content}`}>
                    <div className={`${style.item} flex between-xs`}>
                        {encData ? (
                            <CodeBox content={encData} />
                        ) : (
                            <a href={`${TEST_URL}?lng=${lng}`} target="_blank" rel="noopener noreferrer">need to pass
                                the test</a>
                        )}
                    </div>

                    <div className={`${style.item} flex between-xs`}>
                        {encData ? (
                            <a href={testResultLink} target="_blank" rel="noopener noreferrer">Перейти к
                                психологическому профилю</a>
                        ) : (
                            <a href={`${TEST_URL}?lng=${lng}`} target="_blank" rel="noopener noreferrer">need to pass
                                the test</a>
                        )}
                    </div>
                </div>
            </div>

            <div className={`${style.box} ${style.danger}`}>
                <h5 className={style.box_title}>Subscription</h5>
                <div className={`${style.box_content}`}>
                    <div className={`${style.item}`}>
                        subscriptions
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
                            onClick={() => deleteAccountBtnHandler()}>
                            Delete account
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )

    function updateProfile(formData: { [key: string]: string }) {
        dispatch(
            updateUserData(formData)
        )
    }

    function changeUserEmail(formData: IOneFieldForm<string>) {
        dispatch(changeEmail(formData))
    }

    function toast() {
        addToast('Изменения приняты', {
            appearance: 'success'
        })
    }

    function deleteAccountBtnHandler() {
        dispatch({ type: DANGER_MODAL, isDangerModal: true })
    }
}

export default UserProfile
