import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Rodal from 'rodal'
import { AiOutlineLoading } from 'react-icons/ai'
import style from './danger-modal.module.scss'
import Button from '../../../common/buttons/button/Button'
import { globalStoreType, IModalProps } from "../../../../constants/types";
import { useTranslation } from "react-i18next"
import Password from "../../Inputs/password/Password";
import { deleteAccount } from "../../../../actions/api/accountAPI";
import { useForm } from "react-hook-form";

const DangerModal: React.FC<IModalProps> = ({ visible, closeModal }) => {
    const dispatch = useDispatch()
    const { isLoading, errorApiMessage } = useSelector((state: globalStoreType) => state.app)
    const { t } = useTranslation()

    const { register, handleSubmit, clearErrors } = useForm<{password: string}>()

    // useEffect(() => {
    //     dispatch({ type: PROCESS_FAILED, processFailed: false })
    // }, [])

    const customStyles = {
        height: 'auto',
        bottom: 'auto',
        top: '30%'
    }

    return (
        <Rodal
            className={`modal danger-modal`}
            visible={visible}
            onClose={closeModal}
            closeMaskOnCLick
            customStyles={customStyles}
            height={350}
            width={400}
            closeOnEsc={true}>
            <div className={`${style.content}`}>
                <div className={style.top}><strong>{t('common:profile.delete.are_you_sure')}</strong></div>
                <div className={style.desc}><p>{t('common:profile.delete.warning_msg_2')}</p></div>
                <div className={style.form}>
                    <p>{t('common:profile.delete.enter_pwd')}</p>
                    <form onSubmit={handleSubmit(data => deleteFormHandler(data))}>
                        <div className="form-group">
                            <Password
                                placeholder={t('common:auth.pwd')}
                                required
                                name="password"
                                innerRef={register({
                                    required: `${ t('common:errors.required') }`,
                                }) }
                            />
                            {errorApiMessage && (
                                <div className="item-explain api-error">{errorApiMessage}</div>
                            )}
                        </div>
                        <Button
                            title={t('common:profile.delete.delete_account')}
                            startIcon={isLoading && <AiOutlineLoading />}
                            handle={() => null}
                            btnClass="btn btn-danger btn-loader"
                        />
                    </form>
                </div>
            </div>
        </Rodal>
    )

    function deleteFormHandler(data: {password: string}) {
        dispatch(deleteAccount(data.password))
    }
}

export default DangerModal
