import React from 'react'
import style from './button.module.scss'

export type ButtonType = {
    title: string
    btnClass?: string
    startIcon?: React.ReactNode | null
    endIcon?: React.ReactNode | null
    handle: () => void
    isEnabled?: boolean
}

const Button = ({ title, btnClass, startIcon = null, endIcon = null, handle, isEnabled = true }: ButtonType) => {

    const ariaLabel: string = !title ? 'button' : '';

    return (
        <button className={`${style.btn} ${btnClass} ${!isEnabled && style.disabled}`} onClick={handle}
                aria-label={ariaLabel} tabIndex={0}>
            {startIcon && <span className={style.start}>{startIcon}</span>}
            {title}
            {endIcon && <span className={style.end}>{endIcon}</span>}
        </button>
    )
}

export default Button
