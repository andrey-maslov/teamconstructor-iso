import React, {useMemo} from 'react'
import {FaTrashAlt} from 'react-icons/fa'
import {IDraggableItem} from "./DraggableItem"
import { UserResult} from "../../../../../UserResult"
import style from './draggable-item.module.scss'
import {Radar} from "react-chartjs-2"
import {COLORS} from '../../../../../constants/constants'

const ItemContent: React.FC<IDraggableItem> = ({index, employeeProfile, colIndex, deleteItem}) => {

    const profile = useMemo(() => UserResult.getProfile(employeeProfile.decData[1]), [employeeProfile])

    const data = {
        labels: ['','','','','','','','',],
        datasets:
            [
                {
                    backgroundColor: COLORS.orange,
                    pointBackgroundColor: COLORS.orange,
                    borderColor: COLORS.orange,
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
                    width={60}
                    height={60}
                />
            </div>
            <div className={style.content}>
                <div className={style.name}>{employeeProfile.name}</div>
                <div className={style.position}>{employeeProfile.position}</div>
            </div>

            <button
                className={style.delete}
                onClick={() => {deleteItem(colIndex, index)}}
            >
                <FaTrashAlt/>
            </button>

        </div>
    );
}

export default ItemContent;