import React from 'react'
import style from './search.module.scss'

interface SearchPanelProps {
    changeHandler: (e: any) => void
}

const SearchPanel: React.FC<SearchPanelProps> = ({ changeHandler }) => {

    return (
        <div className={style.panel}>
            <input type="text" onChange={changeHandler} tabIndex={0} autoFocus={true} />
        </div>
    )
}

export default SearchPanel
