import React, {useEffect, useState} from 'react'
import style from './circle-diagram.module.scss'
import {getKeyResult} from 'psychology'

interface CircleDiagramProps {
    value: number
}

const CircleDiagram: React.FC<CircleDiagramProps> = ({value}) => {

    const roundValue = Math.round(value * 100)

    const color = getKeyResult(value, ['defective', 'normal', 'good', 'excellent'])

    const [val, setVal] = useState(0)
    const [isFinish, setFinish] = useState(false)

    useEffect(() => {
        function spidometer() {
            if (val < roundValue) {
                setTimeout( increment, 20)
            } else if (val === roundValue) {
                setFinish(true)
            } else if (val > roundValue) {
                setTimeout( decrement, 20)
            }
        }

        spidometer()

        return function cleanup() {
            spidometer()
        }
    }, [val, roundValue])

    function increment() {
        setVal(val + 1)
    }
    function decrement() {
        setVal(val - 1)
    }

    return (
        <div className={style.wrapper}>
            <svg viewBox="0 0 100 50" className={style.donut}>
                <defs>
                    <linearGradient id="gradient" className={style.gradient}>
                        <stop offset="0%"/>
                        <stop offset="20%"/>
                        <stop offset="80%"/>
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
    )
}

export default CircleDiagram
