import React from 'react'
import style from './input-field.module.scss'
import {useTranslation} from "react-i18next";

interface IInputField {
    label: string
    value: string
    placeholder?: string
    nameRef: any
    dataRef: any
    errors: any
}

const InputField: React.FC<IInputField> = ({label, value, placeholder, nameRef, dataRef, errors}) => {

    const {t} = useTranslation();

    return (
        <div className={style.wrapper}>
            <div className={`${style.title} form-group ${errors[`name${label}`] ? 'has-error' : ''}`}>
                <input
                    type="text"
                    name={`name${label}`}
                    defaultValue={`${t('pair:profile')} ${label}`}
                    ref={nameRef}
                    onFocus={(e: any) => e.target.select()}
                    placeholder={`${t('pair:profile')} ${label}`}
                    autoComplete={'off'}
                />
                {errors[`name${label}`] && <div className={`item-explain`}>{errors[`name${label}`].message}</div>}
            </div>
            <div className={`form-group ${errors[`data${label}`] ? 'has-error' : ''}`}>
                <textarea
                    name={`data${label}`}
                    defaultValue={value}
                    placeholder={placeholder}
                    ref={dataRef}
                />
                {errors[`data${label}`] && <div className={`item-explain`}>{errors[`data${label}`].message}</div>}
                {errors[`data${label}`] && errors[`data${label}`].type === 'decode' && (
                    <div className={`item-explain`}>{t('common:errors.invalid')}</div>
                )}
            </div>
        </div>
    );
}

export default InputField;