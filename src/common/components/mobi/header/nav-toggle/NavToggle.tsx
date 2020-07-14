import React from 'react'
import style from './nav-toggle.module.scss'
import { FiAlignLeft } from 'react-icons/fi'

type NavToggle = {
    handler: () => void
}

const NavToggle = ({handler}: NavToggle) => {

    return (
        <button className={style.btn} onClick={handler}>
            <FiAlignLeft/>
        </button>
    );

};

export default NavToggle;