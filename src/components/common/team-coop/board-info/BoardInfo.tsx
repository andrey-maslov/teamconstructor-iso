import React from 'react'
import style from './board-info.module.scss'

const BoardInfo: React.FC<{ label: string }> = ({ label }) => {

    return (
        <div className={style.wrapper}>
            <h2
                className={style.title}
                dangerouslySetInnerHTML={{ __html: label }}
            />
        </div>
    );
}

export default BoardInfo
