import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import style from './profile.module.scss'
import { globalStoreType, IOneFieldForm } from '../../../constants/types'
import { NavLink } from 'react-router-dom'
import Loader from '../../../components/common/loaders/loader/Loader'
import InputTransformer from '../../../components/common/Inputs/input-transformer/InputTransformer'
import CodeBox from '../../../components/common/Inputs/code-box/CodeBox'
import { DANGER_MODAL, SET_TOAST } from '../../../actions/actionTypes'
import { changeEmail, updateUserData } from "../../../actions/api/accountAPI"
import { TEST_URL } from "../../../constants/constants";
import Billing from "../../../components/common/billing/Billing";

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
    // const [isReady, setReady] = useState(false)
    const { addToast } = useToasts()
    const dispatch = useDispatch()

    const { isEmailSent, toastStatus } = useSelector((state: globalStoreType) => state.app)
    const lng = i18n.language.toUpperCase()

    const [localUser, setLocalUser] = useState({
        firstName,
        lastName,
        email,
        position,
    })

    useEffect(() => {
        // if (email) {
        //     setReady(true)
        // }
        if (toastStatus === 1) {
            addToast(t('common:changes_approved'), {
                appearance: 'success'
            })
        } else if (toastStatus === 2) {
            addToast(t('common:something_wrong'), {
                appearance: 'error'
            })
        }

        function updateLocalData() {
            setLocalUser({
                firstName,
                lastName,
                email,
                position
            })

            dispatch({ type: SET_TOAST, toastStatus: 0 })
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

    // if (!isReady) {
    //     return <Loader />
    // }

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
                <h2 className={style.title}>{t('common:profile.title')}</h2>
                <p>{t('common:profile.desc')}.</p>
                <p>
                    <NavLink to="/terms">
                        {t('common:profile.more_terms')}
                    </NavLink>
                    {` ${t('common:or')} `}
                    <NavLink to="/policies/privacy-policy">
                        {t('common:profile.more_privacy')}
                    </NavLink>
                </p>
            </div>

            <div className={`${style.box} ${style.account}`}>
                <h5 className={style.box_title}>
                    {t('common:profile.account_title')}
                    {email && !emailConfirmed && <span className="color-red">
                        {t('common:profile.email_needs_confirm')}
                    </span>}
                    {!email && <span className="color-red">
                        {t('common:profile.need_to_set_email')}
                    </span>}
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
                <h5 className={style.box_title}>{t('common:profile.psy_block_title')}</h5>
                <div className={`${style.box_content}`}>
                    <div className={`${style.item} flex between-xs`}>
                        {encData ? (
                            <CodeBox content={encData} />
                        ) : (
                            <a href={`${TEST_URL}?lng=${lng}`} target="_blank" rel="noopener noreferrer">
                                {t('common:profile.no_test_result')}
                            </a>
                        )}
                    </div>

                    <div className={`${style.item} flex between-xs`}>
                        {encData ? (
                            <a href={testResultLink} target="_blank" rel="noopener noreferrer">
                                {t('common:profile.go_to_psy_profile')}
                            </a>
                        ) : (
                            <a href={`${TEST_URL}?lng=${lng}`} target="_blank" rel="noopener noreferrer">
                                {t('common:profile.no_test_result')}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className={`${style.box} ${style.tariff}`}>
                <div className={style.head}>
                    <h5 className={style.box_title}>{t('common:profile.subscr_block_title')}</h5>
                    <NavLink to="/subscriptions" className={style.btn}>
                        {t('common:change')}
                    </NavLink>
                </div>
                <div className={`${style.box_content}`}>
                    <div className={`${style.item}`}>
                        <Billing />
                    </div>
                </div>
            </div>

            <div className={`${style.box} ${style.danger}`}>
                <h5 className={style.box_title}>{t('common:profile.danger_block_title')}</h5>
                <div className={`${style.box_content}`}>
                    <div className={`${style.item} ${style.delete}`}>
                        <div>
                            {t('common:profile.delete.warning_msg_1')}.
                        </div>
                        <button
                            className="btn"
                            onClick={() => deleteAccountBtnHandler()}>
                            {t('common:profile.delete.btn')}
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

    function deleteAccountBtnHandler() {
        dispatch({ type: DANGER_MODAL, isDangerModal: true })
    }
}

export default UserProfile
