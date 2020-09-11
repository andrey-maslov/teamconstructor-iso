import React from 'react'
import {Polar} from 'react-chartjs-2'
import {COLORS} from '../../../../../constants/constants'
import hexToRgba from '../../../../../helper/hexToRgba'
import {useMediaPredicate} from 'react-media-hook'
import style from './polar-chart.module.scss'

const colors = [
    COLORS.orange,
    COLORS.accent,
    COLORS.yellow,
    COLORS.green,
    COLORS.accent2,
    // COLORS.textLight,
    COLORS.orange,
    COLORS.accent,
    COLORS.yellow,
]

type ChartsPropsType = {
    portrait: number[]
    labels: string[]
}

const PolarChart: React.FC<ChartsPropsType> = ({portrait, labels}) => {

    const chartLabels = labels;
    const chartColors = colors;

    const chartRadarOptions: any = {
        desktop: {
            width: 530,
            height: 428,
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
        labels: labels,
        datasets: [{
            data: portrait,
            backgroundColor: chartColors.map(color => hexToRgba(color, .7)),
            borderColor: chartColors,
        }],
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
                <Polar
                    data={data}
                    options={options}
                    width={currentOptions.width}
                    height={currentOptions.height}
                />
            </div>
        </div>
    );

};

export default PolarChart;