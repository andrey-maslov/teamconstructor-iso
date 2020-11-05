import React from 'react'
import style from './team-spec.module.scss'
import {IoMdConstruct} from "react-icons/io"
import {FaLightbulb, FaAward, FaUniversalAccess, FaShoppingCart} from "react-icons/fa"
import {useTranslation} from "react-i18next";

const icons = [
    <FaUniversalAccess key={0}/>,
    <FaLightbulb key={1}/>,
    <FaShoppingCart key={2}/>,
    <IoMdConstruct key={3}/>,
    <FaAward key={4}/>
]


interface TeamSpecProps {
    teamSpec: number
    changeSpec: any
    isCompact: boolean
}

const TeamSpec: React.FC<TeamSpecProps> = ({teamSpec, changeSpec, isCompact}) => {

    const {t} = useTranslation()
    const values: string[] = t('team:page.spec_list', {returnObjects: true})

    return (
        <div className={`${style.wrapper} ${isCompact ? style.compact : style.full}`}>
            <h4 className={style.title}>{t('team:page.spec_title')}</h4>
            <form>
                {typeof values === 'object' && values.map((value, i) => (
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