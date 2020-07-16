import React, {useEffect, useState} from 'react';

import style from './circle-diagram.module.scss'

interface CircleDiagramProps {
    value: number
}

const CircleDiagram: React.FC<CircleDiagramProps> = ({value}) => {

    const roundValue = Math.round(value)

    const color = roundValue > 33 ? (roundValue < 66 ? 'warning' : 'success' ) : 'danger';

    const [val, setVal] = useState(0)
    const [isFinish, setFinish] = useState(false)

    useEffect(() => {
        if (val < roundValue) {
           setTimeout( increment, 20)
        } else if (val === roundValue) {
            setFinish(true)
        }
    }, [val])

    function increment() {
        setVal(val + 1)
    }


    return (
        <div className={style.wrapper}>
            <svg viewBox="0 0 100 50" className={style.donut}>
                <defs>
                    <linearGradient id="gradient" className={style.gradient}>
                        <stop offset="0%"/>
                        <stop offset="50%"/>
                        <stop offset="100%"/>
                    </linearGradient>
                </defs>

                <g className={style.base}>
                    <path className={style.half} d="M5 50a45 45 0 1 1 90 0" />
                    <path
                        className={style.shadow}
                        strokeDashoffset={142 - (val * 142 / 100)}
                        d="M5 50a45 45 0 1 1 90 0"
                        stroke="url(#gradient)"
                    />
                    <path
                        className={style.progress}
                        strokeDashoffset={142 - (val * 142 / 100)}
                        d="M5 50a45 45 0 1 1 90 0"
                        stroke="url(#gradient)"
                    />
                </g>
            </svg>
            <div className={`${style.value} ${isFinish ? style[color] : ''}`}>{val}%</div>
        </div>
    );
}

export default CircleDiagram;