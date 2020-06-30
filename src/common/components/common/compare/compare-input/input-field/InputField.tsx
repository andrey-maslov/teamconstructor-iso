import React from 'react';
import style from './input-field.module.scss';

interface InputFieldProps {
    label: string
    name: string
    id: string
    value: string
    placeholder?: string
}

const InputField: React.FC<InputFieldProps> = ({label, name, id, value, placeholder}) => {

    return (
        <div className={style.wrapper}>
            <h4 className={style.title}>{label}</h4>
            <textarea
                name={name}
                id={id}
                defaultValue={value}
                placeholder={placeholder}
            />
        </div>
    );
}

export default InputField;