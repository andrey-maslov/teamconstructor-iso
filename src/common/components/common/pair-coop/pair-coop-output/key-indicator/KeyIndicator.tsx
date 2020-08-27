import React from "react"
import CircleDiagram from "../../../charts/circle-diagram/CircleDiagram"
import style from "./key-indicator.module.scss"
import PopoverMore from "../../../popovers/popover-more/PopoverMore";

export interface IKeyIndicator {
    title: string
    value: number
    description?: string
    more?: string
}

const KeyIndicator: React.FC<IKeyIndicator> = ({title, description, value, more}) => {

    return (
        <div className={style.comp}>
            {more && <div className={style.more}><PopoverMore data={[more]}/></div>}
            <h5>{title}</h5>
            <CircleDiagram value={value}/>
            {description && <small>{description}</small>}
        </div>
    )
}

export default KeyIndicator