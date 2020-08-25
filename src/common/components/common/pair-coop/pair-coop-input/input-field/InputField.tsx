import React from 'react'
import style from './input-field.module.scss'

interface IInputField {
    label: string
    value: string
    placeholder?: string
    nameRef: any
    dataRef: any
    errors: any
}

const InputField: React.FC<IInputField> = ({label, value, placeholder, nameRef, dataRef, errors}) => {


    return (
        <div className={style.wrapper}>
            <div className={`${style.title} form-group ${errors[`name${label}`] ? 'has-error' : ''}`}>
                <input
                    type="text"
                    name={`name${label}`}
                    defaultValue={`Профиль ${label}`}
                    ref={nameRef}
                    onFocus={(e: any) => e.target.select()}
                    placeholder={`Профиль ${label}`}
                    autoComplete={'off'}
                />
                {errors[`name${label}`] && <div className={`item-explain`}>{errors[`name${label}`] .message}</div>}
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
                    <div className={`item-explain`}>Значение невалидно</div>
                )}
            </div>
        </div>
    );
}

export default InputField;