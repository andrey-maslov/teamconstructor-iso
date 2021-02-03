import React, { useState } from 'react';
import style from "./collector.module.scss";
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useTranslation } from "react-i18next";

export interface ICollectEmailForm {
    email: string
}

const IEmailCollecor: React.FC = () => {

    const { t } = useTranslation()
    const [isSent, setSent] = useState(false)
    const { register, handleSubmit, reset, errors } = useForm<ICollectEmailForm>()

    if(isSent) {
        return (
            <div className={`${style.success} ${style.wrapper}`}>
                <h2>{t('landing:comingSoon.thank')}</h2>
            </div>
        )
    }

    return (
        <div className={style.wrapper}>
            <form className={style.form} onSubmit={handleSubmit(submitHandle)}>
                <label className={style.label}>
                    <input
                        name="email"
                        placeholder="your email"
                        onFocus={clearApiError}
                        aria-label="email"
                        ref={register({
                            required: `${t('common:errors.required')}`,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: `${t('common:errors.invalid_email')}`
                            }
                        })}
                    />
                </label>
                <button type="submit" className={`btn btn-accent ${style.btn}`}>{t('common:buttons.send')}</button>
            </form>
            {errors.email && <div className={`item-explain ${style.error}`}>{errors.email.message}</div>}
            <small>*{t('landing:comingSoon.email_collector_confirm')}</small>
        </div>
    )

    function submitHandle(data: ICollectEmailForm) {

        const { email } = data

        axios
            .post(
                '/save-email',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(() => {
                reset()
                setSent(true)
            })
    }

    function clearApiError() {
        console.log('clear error')
    }
}

export default IEmailCollecor;