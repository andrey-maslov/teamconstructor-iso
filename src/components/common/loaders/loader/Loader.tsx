import React from 'react'
import style from './loader.module.scss'

type LoaderProps = {
    type?: string
}

const Loader: React.FC<LoaderProps> = ({ type }) => {
    return (
        <div className={`${style.wrapper} ${type === 'full-page' ? style.fp : ''}`}>
            <div className={style.facebook}>
                <div />
                <div />
                <div />
            </div>
        </div>
    )
}

export default Loader
