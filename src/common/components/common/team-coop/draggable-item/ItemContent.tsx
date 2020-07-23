import React from 'react'
import {FaUserCircle, FaTrashAlt} from 'react-icons/fa'
import {IDraggableItem} from "./DraggableItem"

import style from './draggable-item.module.scss'

const ItemContent: React.FC<IDraggableItem> = ({index, profile, colIndex, deleteItem}) => {

    return (
        <div className={style.inner}>
            <div className={style.avatar}>
                <FaUserCircle/>
            </div>
            <div className={style.content}>
                <div className={style.name}>{profile.name}</div>
                <div className={style.position}>{profile.position}</div>
            </div>

            <button
                className={style.delete}
                onClick={() => {deleteItem(colIndex, index)}}
            >
                <FaTrashAlt/>
            </button>

        </div>
    );
}

export default ItemContent;