import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {useSelector} from 'react-redux'
import { getChartLabels, getRealData } from '../../../../../../helper/helper';
import { COLORS } from '../../../../../../constants/constants';
import hexToRgba from '../../../../../../helper/hexToRgba';
import { useMediaPredicate } from 'react-media-hook';
import { useTranslation } from 'react-i18next';
import style from './charts.module.scss';
import CircleDiagram from "./circle-diagram/CircleDiagram";

type ChartsPropsType = {
    userProfile1: [string, number][]
    userProfile2: [string, number][]
    compatibility: number
}

const Charts: React.FC<ChartsPropsType> = ({userProfile1, userProfile2, compatibility}) => {

    const {t} = useTranslation();
    const userName1 = useSelector((state: any) => state.pairCoopReducer.user1.name)
    const userName2 = useSelector((state: any) => state.pairCoopReducer.user2.name)

    const chartLabels = getChartLabels(userProfile1);

    const chartRadarOptions: any = {
        desktop: {
            width: 550,
            height: 420,
            labels: chartLabels,
        },
        mobi: {
            width: 350,
            height: 300,
            labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        }
    };

    const isMobi = useMediaPredicate('(max-width: 600px)');

    const currentOptions = !isMobi ? {...chartRadarOptions.desktop} : {...chartRadarOptions.mobi};

    const data = {
        labels: currentOptions.labels,
        datasets: [
            {
                label: userName1,
                backgroundColor: hexToRgba(COLORS.orange, .5),
                pointBackgroundColor: COLORS.orange,
                borderColor: COLORS.orange,
                pointRadius: 7,
                data: getRealData(userProfile1)
            },
            {
                label: userName2,
                backgroundColor: hexToRgba(COLORS.accent, .5),
                pointBackgroundColor: COLORS.accent,
                borderColor: COLORS.accent,
                pointRadius: 7,
                data: getRealData(userProfile2)
            }
        ]
    };

    // chartjs.org/docs/latest/configuration/tooltip.html#tooltip-callbacks
    const options = {
        scale: {
            reverse: false,
            gridLines: {
                color: '#5d626d'
            },
            ticks: {
                // suggestedMax: 30,
                beginAtZero: true
            },
            pointLabels: {
                fontSize: 15
            }
        },
        tooltips: {
            // enabled: false,
            callbacks: {
                title: function(tooltipItem: any) {
                    const i = tooltipItem[0].index;
                    return chartLabels[i];
                },
            }
        },
    };

    // @ts-ignore
    return (
        <>
            <div className={style.top}>
                <h4 className={style.title}>{`Результаты анализа совместимости пары ${userName1} и ${userName2}`}</h4>

            </div>
            <div className={`${style.wrapper} radar-chart block-wrapper`}>
                <div className={style.radar}>
                    <Radar
                        data={data}
                        options={options}
                        width={currentOptions.width}
                        height={currentOptions.height}
                    />
                </div>
                <div>
                    <div className={style.comp}>
                        <h5>Совместимость</h5>
                        <CircleDiagram value={compatibility}/>
                        <small>Вероятность того, что пара будет устойчива на протяжение 5-7 лет</small>
                    </div>
                </div>
            </div>
        </>
    );

};

export default Charts;