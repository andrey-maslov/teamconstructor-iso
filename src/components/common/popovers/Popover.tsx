import React from 'react'
import style from "./popover.module.scss"

interface PopoverProps {
    isVisible: boolean
    className?: string
}

export const Popover: React.FC<PopoverProps> = ({ children, isVisible, className }) => {

    if (!isVisible) {
        return null
    }

    return (
        <div className={`${style.wrapper} ${className}`}>
            {children}
        </div>
    )
}