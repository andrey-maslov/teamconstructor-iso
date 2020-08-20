import React from 'react'
import style from './team-spec.module.scss'
import {IoMdConstruct} from "react-icons/Io"
import {FaLightbulb, FaAward, FaUniversalAccess, FaShoppingCart} from "react-icons/fa"

const values = ['Универсальная', 'Идея', 'Продажи', 'Реализация', 'Качество']
const icons = [<FaUniversalAccess key={0}/>, <FaLightbulb key={1}/>, <FaShoppingCart key={2}/>, <IoMdConstruct key={3} />, <FaAward key={4} />]


interface TeamSpecProps {
    teamSpec: number
    changeSpec: any
}

const TeamSpec: React.FC<TeamSpecProps> = ({teamSpec, changeSpec}) => {


    return (
        <div className={style.wrapper}>
            <h4 className={style.title}>Специализация команды</h4>
            <form>
                {values.map((value, i) => (
                    <label className={style.label} key={value}>
                        <input
                            value={value}
                            type="radio"
                            name="spec"
                            defaultChecked={i === teamSpec}
                            onChange={() => changeSpec(i)}
                        />
                        {icons[i]}
                        <span>{value}</span>
                    </label>
                ))}
            </form>
        </div>
    );
}

export default TeamSpec;