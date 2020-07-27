import React from "react";
import {FaTrashAlt} from "react-icons/fa";

import style from './droppable-column.module.scss'


interface ColumnTop {
    label: string
    deleteHandler: (colIndex: number) => void
    columnIndex: number
}

const ColumnTop: React.FC<ColumnTop> = ({deleteHandler, label, columnIndex}) => {

    return (
        <div className={style.top}>
            <h5 className={style.colTitle}>{label}</h5>
            <button
                className={style.delete}
                onClick={() => {
                    deleteHandler(columnIndex)
                }}
            >
                <FaTrashAlt/>
            </button>
        </div>
    )
}

export default ColumnTop;