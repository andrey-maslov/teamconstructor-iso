import React from 'react'
import style from './filter.module.scss'

interface FilterPanelProps {
    changeHandler: (e: any) => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ changeHandler }) => {

    return (
        <div className={style.panel}>
            <input type="text" onChange={changeHandler} tabIndex={0} autoFocus={true} />
        </div>
    )
}

export default FilterPanel
