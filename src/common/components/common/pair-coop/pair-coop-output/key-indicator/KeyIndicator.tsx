import React from "react";
import style from "../../../charts/radar-chart/radar-chart.module.scss";
import CircleDiagram from "../../../charts/circle-diagram/CircleDiagram";

export interface IKeyIndicator {
    title: string
    description?: string
    value: number
}

const KeyIndicator: React.FC<IKeyIndicator> = ({title, description, value}) => {

    return (
        <div className={style.comp}>
            <h5>{title}</h5>
            <CircleDiagram value={value}/>
            {description && <small>{description}</small>}
        </div>
    )
}

export default KeyIndicator