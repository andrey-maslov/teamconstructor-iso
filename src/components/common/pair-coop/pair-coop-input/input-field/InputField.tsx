import React from 'react'
import style from './input-field.module.scss'
import { useTranslation } from "react-i18next"
import { AnyType } from "../../../../../constants/types";

interface IInputField {
    name: string
    encData: string
    index: number
    placeholder?: string
    nameRef: AnyType
    dataRef: AnyType
    errors: AnyType
}

const InputField: React.FC<IInputField> = ({ name, encData, index, placeholder, nameRef, dataRef, errors }) => {

    const { t } = useTranslation()

    return (
        <div className={style.wrapper}>
            <div className={`${style.title} form-group ${errors[`name${index}`] ? 'has-error' : ''}`}>
                <input
                    type="text"
                    name={`name${index}`}
                    defaultValue={name}
                    ref={nameRef}
                    onFocus={(e: React.ChangeEvent<HTMLInputElement>) => e.target.select()}
                    placeholder={name}
                    autoComplete="off"
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