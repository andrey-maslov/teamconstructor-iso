import React from 'react';
import style from './box.module.scss'

interface IBoxProps {
    title?: string
    icon?: React.ReactNode
    addClass?: string
    widget?: React.ReactNode
    children: React.ReactNode
}

const Box: React.FC<any> = ({title, icon, addClass = '', widget, children}) => {

    return (
        <div className={`${style.wrapper} ${addClass}`}>
            {(title || widget) &&
                <div className={`${style.top} top`}>
                    {title && <h3 className={style.title}>{icon}{title}</h3>}
                    {widget}
                </div>
            }
            <div className={style.content}>
                {children}
            </div>
        </div>
    );
}

export default Box;