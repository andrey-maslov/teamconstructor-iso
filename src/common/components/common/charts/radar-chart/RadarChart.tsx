import React from 'react'
import {Radar} from 'react-chartjs-2'
import {getChartLabels, getRealData} from '../../../../../helper/helper'
import {COLORS} from '../../../../../constants/constants'
import hexToRgba from '../../../../../helper/hexToRgba'
import {useMediaPredicate} from 'react-media-hook'
import style from './radar-chart.module.scss'

const chartColors = [
    COLORS.orange,
    COLORS.accent
]

type ChartsPropsType = {
    profiles: { name: string, data: [string, number][] }[]
}

const RadarChart: React.FC<ChartsPropsType> = ({profiles}) => {

    const chartLabels = getChartLabels(profiles[0].data);

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
        datasets: profiles.map((profile, i) => ({
            label: profile.name,
            backgroundColor: hexToRgba(chartColors[i], .5),
            pointBackgroundColor: chartColors[i],
            borderColor: chartColors[i],
            pointRadius: 7,
            data: getRealData(profile.data)
        })),
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
                title: function (tooltipItem: any) {
                    const i = tooltipItem[0].index;
                    return chartLabels[i];
                },
            }
        },
    };

    return (
        <div className={`${style.wrapper} radar-chart block-wrapper`}>
            <div className={style.radar}>
                <Radar
                    data={data}
                    options={options}
                    width={currentOptions.width}
                    height={currentOptions.height}
                />
            </div>
        </div>
    );

};

export default RadarChart;