import React from 'react'
import {GoSettings} from 'react-icons/go'
import style from './open-sidebar.module.scss'

export const OpenSidebarBtn: React.FC<{handler: ()=>void}> = ({handler}) => {

    return (
        <button className={style.btn} onClick={handler}>
            <GoSettings/>
        </button>
    );
}