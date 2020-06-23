import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { getChartLabels, getRealData } from '../../../../../../helper/helper';
import { COLORS } from '../../../../../../constants/constants';
import hexToRgba from '../../../../../../helper/hexToRgba';
import Box from '../../../layout/box/Box';
import { useMediaPredicate } from 'react-media-hook';
import { useTranslation } from 'react-i18next';
import style from './radar-chart.module.scss';

type ChartsPropsType = {
    userProfile1: [string, number][]
    userProfile2: [string, number][]
}

const ChartRadar: React.FC<ChartsPropsType> = ({userProfile1, userProfile2}) => {

    const {t} = useTranslation();

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
                label: 'User 1',
                backgroundColor: hexToRgba(COLORS.orange, .5),
                pointBackgroundColor: COLORS.orange,
                borderColor: COLORS.orange,
                pointRadius: 7,
                data: getRealData(userProfile1)
            },
            {
                label: 'User 2',
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
                color: ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']
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
        <Box>
            <div className={style.top}>
                <h4 className={style.title}>Comparison result</h4>

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
                    <div className={style.desc}>
                        some description
                    </div>
                </div>
            </div>
        </Box>
    );

};

export default ChartRadar;