import React from 'react'
import style from './input-field.module.scss'
import { useTranslation } from "react-i18next"
import { anyType } from "../../../../../constants/types";

interface IInputField {
    name: string
    encData: string
    index: number
    placeholder?: string
    nameRef: anyType
    dataRef: anyType
    errors: anyType
    onBlur: anyType
}

const InputField: React.FC<IInputField> = ({
                                               name,
                                               encData,
                                               index,
                                               placeholder,
                                               nameRef,
                                               dataRef,
                                               errors,
                                               onBlur
                                           }) => {

    const { t } = useTranslation()

    console.log(name)

    return (
        <div className={style.wrapper}>
            <div className={`${style.title} form-group ${errors[`name${index}`] ? 'has-error' : ''}`}>
                <input
                    type="text"
                    name={`name${index}`}
                    // defaultValue={name}
                    ref={nameRef}
                    onFocus={(e: React.ChangeEvent<HTMLInputElement>) => e.target.select()}
                    // placeholder={name}
                    autoComplete="off"
                    onBlur={onBlur}
                />
                {errors[`name${index}`] && <div className={`item-explain`}>{errors[`name${index}`].message}</div>}
            </div>
            <div className={`form-group ${errors[`data${index}`] ? 'has-error' : ''}`}>
                <textarea
                    name={`data${index}`}
                    defaultValue={encData}
                    placeholder={placeholder}
                    ref={dataRef}
                />
                {errors[`data${index}`] && <div className={`item-explain`}>{errors[`data${index}`].message}</div>}
                {errors[`data${index}`] && errors[`data${index}`].type === 'decode' && (
                    <div className={`item-explain`}>{t('common:errors.invalid')}</div>
                )}
            </div>
        </div>
    )
}

export default InputField