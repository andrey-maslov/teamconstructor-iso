import React from 'react';
import style from './select.module.scss';

interface SelectProps {
    handler: () => void,
    values: Array<any>,
    selected: string
}

export const Select: React.FC<SelectProps> = ({ handler, values, selected }) => {

    return (
        <select className={style.select} onChange={handler} defaultValue={selected}>
            {values.map((value) => <option value={value} key={value}>{value}</option>)}
        </select>
    )
};