import React from 'react'
import style from './filter.module.scss'

interface FilterPanelProps {
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
    value: string
}

const FilterPanel: React.FC<FilterPanelProps> = ({ changeHandler, value }) => {

    return (
        <div className={style.panel}>
            <input type="text" onChange={changeHandler} value={value} tabIndex={0} autoFocus={true} />
        </div>
    )
}

export default FilterPanel
