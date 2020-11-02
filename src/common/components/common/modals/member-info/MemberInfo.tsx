import React, { useEffect, useState } from 'react'
import Rodal from 'rodal'
import { useSelector, useDispatch } from 'react-redux'
import style from './member-info.module.scss'
import { globalStoreType, IModalProps, ITeam } from '../../../../../constants/types'
import { UserResult } from 'psychology'
import { IMember, baseTestResultType, IUserResult, DecodedDataType } from 'psychology/build/main/types/types'
import { getAndDecodeData } from 'psychology'
import { setEditedMember, updateProject } from '../../../../actions/actionCreator'
import { useTranslation } from 'react-i18next'
import RadarChart from "../../charts/radar-chart/RadarChart";
import { Radar } from "react-chartjs-2";
import hexToRgba from "../../../../../helper/hexToRgba";
import { COLORS } from "../../../../../constants/constants";
import Loader from "../../loaders/loader/Loader";
import axios from "axios";
import Table from "../../tables/table/Table";

const colors = [
    COLORS.orange,
    COLORS.accent,
    COLORS.yellow
]


export const MemberInfo: React.FC<IModalProps> = ({ visible, closeModal }) => {

    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [state, setState] = useState({ portraitDesc: [[]], psychoTypeDesc: '' })
    const { terms, descriptions } = useSelector((state: globalStoreType) => state.terms)
    const { editedMember, teams } = useSelector((state: globalStoreType) => state.team)
    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []

    // const member: IMember = {
    //     decData: [[1, 1, 0], [[-2, -3, -1, 2, -1], [-2, -2, -2, -4, -1], [-2, -1, -2, 1, -6], [-1, 1, 1, -2, -3], [1, -3, 2, 1, -2]]],
    //     position: 'developer',
    //     name: 'Test Member',
    //     id: 'sfsdf',
    //     baseID: 666
    // }

    useEffect(() => {

        function fetchMemberData(encData: string) {
            const url = `https://salary.nobugs.today/api/v1/test/result`

            axios.post(url, {
                data: {
                    encData
                }
            })
                .then(res => res.data)
                .then(data => {
                    console.log(data)
                    setState(data)
                    return data
                })
                .catch(err => {
                    console.error(err)
                    return { data: 'something wrong' }
                })
        }

        if (member.decData) {
            fetchMemberData(btoa(JSON.stringify(member.decData)))
        }

        return function clearAll() {
            dispatch(setEditedMember(null))
        }
    }, [terms, editedMember])

    if (!terms) {
        return null
    }

    if (!state) {
        return <Loader />
    }

    if (editedMember === null) {
        return <div>ERROR, edited member undefined</div>
    }

    const member: IMember = members.filter((item: IMember) => item.baseID === editedMember)[0]
    const fullProfile = UserResult(member.decData[1])
    const profile = fullProfile.profile

    const data = {
        labels: terms.tendencies,
        datasets: [
            {
                backgroundColor: hexToRgba(COLORS.yellow, .5),
                pointBackgroundColor: COLORS.yellow,
                borderColor: COLORS.yellow,
                pointRadius: 7,
                data: profile.map(item => item.value)
            }
        ],
    }

    const options = {
        legend: {
            display: false
        },
        scale: {
            reverse: false,
            gridLines: {
                color: '#5d626d'
            },
            ticks: {
                beginAtZero: true
            },
            pointLabels: {
                fontSize: 15
            }
        },
        tooltips: {
            callbacks: {
                title: function (tooltipItem: any) {
                    const i = tooltipItem[0].index;
                    return terms.tendencies[i];
                },
            }
        },
    }

    const fpTableTile = ['характеристика', 'выявлено']

    console.log(state)

    return (
        <Rodal
            className="member-info-modal"
            visible={visible}
            onClose={closeModal}
            width={1000}
            height={600}
        >
            <div className={style.content}>
                <div className={style.block}>
                    <div className="row around-md middle-xs">
                        <div className="col-md-5">
                            <Radar
                                data={data}
                                options={options}
                                width={400}
                                height={300}
                            />
                        </div>
                        <div className="col-md-5">
                            <div>{state.psychoTypeDesc}</div>
                        </div>
                    </div>
                </div>
                <div className={style.block}>
                    <Table
                        tableData={state.portraitDesc.map(item => [
                            item[0],
                            item[1]
                        ])}
                        tableHeader={fpTableTile}
                        addClasses={['striped']}
                    />
                </div>
                <div className={style.block}>

                </div>
            </div>
        </Rodal>
    )

}