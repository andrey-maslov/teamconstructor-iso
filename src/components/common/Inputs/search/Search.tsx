import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import OutsideClickHandler from 'react-outside-click-handler'
import style from './search.module.scss'
import { AnyType, IOneFieldForm } from '../../../../constants/types'
import { useTranslation } from 'react-i18next'

interface ISearch {
    handler: (value: IOneFieldForm<string>) => void
    onClickOutside: AnyType
}

const Search: React.FC<ISearch> = ({ handler, onClickOutside }) => {
    const { register, handleSubmit, errors } = useForm<IOneFieldForm<string>>()
    const { t } = useTranslation()

    console.log(errors)

    return (
        <div className={style.wrapper}>
            <OutsideClickHandler
                onOutsideClick={onClickOutside}>
                <form onSubmit={handleSubmit(handler)}>
                    <div className={`form-group ${errors.email1 ? 'has-error' : ''} ${style.group}`}>
                        <input
                            placeholder="Введите Email"
                            type="text"
                            name="email1"
                            className={style.input}
                            autoFocus
                            ref={ register({
                                required: `${ t('common:errors.required') }`,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: `${ t('common:errors.invalid_email') }`
                                }
                            }) }
                        />
                        {errors.email1 && <div className="item-explain">{errors.email1?.message}</div>}
                    </div>
                </form>
            </OutsideClickHandler>
        </div>
    )

    function submit(formData: IOneFieldForm<string>): void {
        handler(formData)
    }
}

export default Search
