import React from 'react'
import style from './show-pwd.module.scss'
import { FiEye } from 'react-icons/fi'

interface IOpenPwd {
    handle: () => void
}

function ShowPwd({ handle }: IOpenPwd) {

    return (
        <div role="button" tabIndex={0} className={style.btn} onClick={handle}>
            <FiEye className={style.icon} />
        </div>
    )
}

export default ShowPwd