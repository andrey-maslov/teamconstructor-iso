import React from 'react'
import style from './loader-request.module.scss'

const LoaderRequest: React.FC = () => {
    return (
        <div className={`${style.wrapper} flex-centered`}>
            <div className={style.loader}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default LoaderRequest
