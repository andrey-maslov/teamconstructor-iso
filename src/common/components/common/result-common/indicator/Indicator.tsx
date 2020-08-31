import React from "react"
import style from "./indicator.module.scss"

export interface Indicator {
    title: string
    description: string
    icon?: React.ReactNode
}

const Indicator: React.FC<Indicator> = ({title, description, icon}) => {

    return (
        <div className={style.wrapper}>
            <div className={style.top}>

                {icon ?
                    <span className={`${style.icon}`}>{icon}</span> :
                    <div className={`${style.circle} ${style.icon}`}/>}
                <span>{title}</span>
            </div>
            {description && <div className={style.desc}>{description}</div>}
        </div>
    )
}

export default Indicator