import React, { useMemo } from 'react'
import style from './draggable-item.module.scss'
import { Radar } from "react-chartjs-2"
import { COLORS, TEST_MAX_THRESHOLD, TEST_THRESHOLD } from '../../../../../constants/constants'
import { IMember } from '../../../../../constants/types'
import { getPersonProfile, getPersonPortrait } from 'psychology'

interface IItemContent {
    member: IMember
}

const colors = {
    low: COLORS.accent,
    normal: COLORS.orange,
    high: 'red'
}

type ColorsType = typeof colors

const ItemContent: React.FC<IItemContent> = ({ member }) => {

    const profile = useMemo(() => getPersonProfile(member.decData[1]), [member])
    const portrait = useMemo(() => getPersonPortrait(profile), [member])
    const maxOctantVal = Math.max.apply(null, portrait.map(item => item.value))
    const color = getColor(maxOctantVal, colors)

    const data = {
        labels: ['', '', '', '', '', '', '', '',],
        datasets:
            [
                {
                    backgroundColor: color,
                    pointBackgroundColor: color,
                    borderColor: color,
                    pointRadius: 1,
                    data: profile.map(item => item.value)
                }
            ]
    };

    const options = {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                display: false
            }],
            xAxes: [{
                display: false
            }]
        },
        scale: {
            pointLabels: {
                fontSize: 1
            },
            ticks: {
                display: false
            },
            gridLines: {
                display: false,
                color: COLORS.textLight,
                zeroLineColor: 'red'
            },
            angleLines: {
                color: COLORS.grey
            }
        },
        tooltips: {
            enabled: false,
        },
    }

    return (
        <div className={style.inner}>
            <div className={style.avatar}>
                <Radar
                    options={options}
                    data={data}
                    width={55}
                    height={55}
                />
            </div>
            <div className={style.content}>
                <div className={style.name} dangerouslySetInnerHTML={{ __html: member.name }} />
                <div className={style.position} dangerouslySetInnerHTML={{ __html: member.position }} />
            </div>
        </div>
    );

    function getColor (value: number, colors: ColorsType): string {
        if (value < TEST_THRESHOLD) {
            return colors.low
        }
        if (value > TEST_MAX_THRESHOLD) {
            return colors.high
        }
        return colors.normal
    }
}

export default ItemContent;