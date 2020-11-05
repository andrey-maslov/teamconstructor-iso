import React from "react"
import style from "./indicator.module.scss"

export interface Indicator {
    title: string
    description: string
    status: number
    icon?: React.ReactNode
}

const Indicator: React.FC<Indicator> = ({title, description, status, icon}) => {

    const statuses = ['danger', 'warning', 'success']

    return (
        <div className={`${style.wrapper} ${statuses[status] ? style[statuses[status]] : style.default}`}>
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