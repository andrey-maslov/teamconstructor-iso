import React from 'react';
import {FiSettings} from 'react-icons/fi'
import style from './input-field.module.scss';

interface InputFieldProps {
    label: string
    name: string
    value: string
    placeholder?: string
    hasErrored: boolean
    onChangeHandler: any
    autoFocus?: boolean
}

const InputField: React.FC<InputFieldProps> = (
    {label, name, value, placeholder, hasErrored, onChangeHandler, autoFocus}
) => {

    return (
        <div className={style.wrapper}>
            <div className={style.title}>
                <input
                    type="text"
                    name={`name_${name}`}
                    defaultValue={label}
                    autoFocus={autoFocus}
                    required
                    // onFocus={(e: any) => e.target.select()}
                />
            </div>
            <textarea
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChangeHandler}
            />
            {hasErrored &&
            <div className={style.error}>Вы допустили ошибку. Возможно, неправильный формат ввода</div>}
        </div>
    );
}

export default InputField;