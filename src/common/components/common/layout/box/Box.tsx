import React from 'react';
import style from './box.module.scss'

interface IBoxProps {
    title?: string
    icon?: React.ReactNode
    addClass?: string
    children: React.ReactNode
}

const Box: React.FC<any> = ({title, icon, addClass = '', children}) => {

    return (
        <div className={`${style.wrapper} ${addClass}`}>
            {title && <h3 className={style.title}>{icon}{title}</h3>}
            <div className={style.content}>
                {children}
            </div>
        </div>
    );
}

export default Box;