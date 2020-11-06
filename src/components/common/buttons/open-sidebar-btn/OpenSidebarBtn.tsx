import React from 'react'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import style from './open-sidebar.module.scss'

export const OpenSidebarBtn: React.FC<{ handler: () => void, isCompact: boolean }> = ({ handler, isCompact }) => {

    return (
        <button className={style.btn} onClick={handler}>
            {!isCompact ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </button>
    )
}