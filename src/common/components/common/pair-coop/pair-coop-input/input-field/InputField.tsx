import React, {useRef} from 'react'
import style from './input-field.module.scss'

interface InputFieldProps {
    label: string
    name: string
    value: string
    placeholder?: string
    hasErrored: boolean
    onChangeHandler: any
    nameRef: any
}

const InputField: React.FC<InputFieldProps> = (
    {label, name, value, placeholder, hasErrored, onChangeHandler, nameRef}
) => {

    return (
        <div className={style.wrapper}>
            <div className={style.title}>
                <input
                    type="text"
                    name={`name_${name}`}
                    defaultValue={label}
                    ref={nameRef}
                    onFocus={(e: any) => e.target.select()}
                    placeholder={label}
                    autoComplete={'off'}
                />
            </div>
            <textarea
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChangeHandler}
            />
            {/*{hasErrored &&*/}
            {/*<div className={`msg-error`}>Вы допустили ошибку. Возможно, неправильный формат ввода</div>}*/}
        </div>
    );
}

export default InputField;