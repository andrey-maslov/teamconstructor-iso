import React from 'react';
import style from './input-field.module.scss';

interface InputFieldProps {
    label: string
    name: string
    id: string
    value: string

}

const InputField: React.FC<InputFieldProps> = ({label, name, id, value}) => {

    return (
        <div>
            <h4 className={style.title}>{label}</h4>
            <textarea
                name={name}
                id={id}
                defaultValue={value}
                cols={30}
                rows={10}
            />
        </div>
    );
}

export default InputField;