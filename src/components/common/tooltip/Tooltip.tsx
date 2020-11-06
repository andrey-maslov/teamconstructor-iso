import React from 'react';
import style from './tooltip.module.scss';

interface TooltipProps {
    children: JSX.Element
    tip: string
    direction: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip: React.FunctionComponent<TooltipProps> = ({ children, tip, direction }) => {

    const tipClass = 'tooltip' + direction.charAt(0).toUpperCase() + direction.slice(1);

    return (
        <span
            className={`${style[tipClass]} tooltip`}
            data-tooltip={tip}
        >
            {children}
        </span>
    )
}