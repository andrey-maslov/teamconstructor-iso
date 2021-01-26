import React, { useEffect, useState } from 'react'
import Rodal from 'rodal'
import { useSelector, useDispatch } from 'react-redux'
import style from './member-info.module.scss'
import { globalStoreType, IModalProps } from '../../../../constants/types'
import { UserResult } from 'psychology'
import { IMember, IUserResult } from 'psychology/build/main/types/types'
import { setEditedMember } from '../../../../actions/actionCreator'
import { useTranslation } from 'react-i18next'
import { Radar } from 'react-chartjs-2'
import hexToRgba from '../../../../helper/hexToRgba'
import { COLORS } from '../../../../constants/constants'
import axios from 'axios'
import Table from '../../tables/table/Table'
import { stripCountry } from "../../../../helper/helper"
import Loader from "../../loaders/loader/Loader";
import { useDisableBodyScroll } from "../../hooks/use-disable-body-scroll";

const mockMember: IMember = {
    decData: [[1, 1, 0], [[-2, -3, -1, 2, -1], [-2, -2, -2, -4, -1], [-2, -1, -2, 1, -6], [-1, 1, 1, -2, -3], [1, -3, 2, 1, -2]]],
    position: 'developer',
    name: 'Test Member',
    id: 'sfsdf',
    baseID: 666
}

const url = `${process.env.RAZZLE_TEST_API_URL}/v1/test/employee`

interface ILargeModal extends IModalProps {
    isMobi?: boolean
}

export const MemberInfo: React.FC<ILargeModal> = ({ visible, closeModal, isLarge, isMobi }) => {
    useDisableBodyScroll(visible)
    const { t, i18n } = useTranslation()
    const currLang = stripCountry(i18n.language);
    const dispatch = useDispatch()
    const [state, setState] = useState({ portraitDesc: [[]], fullProfileData: [[]], psychoTypeDesc: '' })
    const { terms } = useSelector((store: globalStoreType) => store.terms)
    const { editedMember, activeProject: { teams } } = useSelector((store: globalStoreType) => store.team)

    const members = (teams.length > 0 && teams[0].items.length > 0) ? teams[0].items : []
    const member: IMember = members.filter((item: IMember) => item.baseID === editedMember)[0]

    useEffect(() => {

        function fetchMemberData(encdata: string, lang: string) {

            axios.post(url, { encdata, lang })
                .then(res => res.data)
                .then(data => {
                    setState(data.description)
                })
                .catch(err => {
                    console.error(err)
                    return { data: 'something wrong' }
                })
        }

        if (member) {
            fetchMemberData(btoa(JSON.stringify(member.decData)), currLang)
        }

        return function clearAll() {
            dispatch(setEditedMember(null))
        }
    }, [terms, editedMember])

    if (editedMember === null) {
        return <div>ERROR, edited member undefined</div>
    }

    const fullProfile: IUserResult = UserResult(member.decData[1])
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

    const fpTableTile = [t('team:characteristic'), t('team:identified')]

    return (
        <Rodal
            className="member-info-modal modal"
            visible={visible}
            onClose={closeModal}
            width={isLarge ? 1000 : (!isMobi ? 600 : 350)}
            height={600}
            closeOnEsc={true}
        >
            <div className={style.body}>
                <div className={style.content}>
                    <div className={style.header}>
                        <strong>{member.name}</strong>, <span>{member.position}</span>
                    </div>
                    {state.psychoTypeDesc.length === 0 ? (
                            <div><Loader /></div>
                        )
                        : (
                            <div className={style.scrollable}>
                                <div className={style.block}>
                                    <div className="row around-md middle-xs">
                                        <div className="col-xl-5">
                                            <div className={style.radar}>
                                                <Radar
                                                    data={data}
                                                    options={options}
                                                    width={isLarge ? 400 : 300}
                                                    height={isLarge ? 300 : 250}
                                                />
                                            </div>
                                        </div>
                                        {state.psychoTypeDesc && (
                                            <div className="col-xl-5">
                                                <div>{state.psychoTypeDesc}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {state.portraitDesc && (
                                    <div className={`${style.block} ${style.tableWrapper}`}>
                                        <div className={style.title}>{t('team:member_psy_portrait')}</div>
                                        <Table
                                            tableData={state.portraitDesc.map(item => [
                                                item[0],
                                                item[1]
                                            ])}
                                            tableHeader={fpTableTile}
                                            addClasses={['striped']}
                                        />
                                    </div>
                                )}

                                {state.fullProfileData && (
                                    <div className={`${style.block} ${style.tableWrapper}`}>
                                        <div className={style.title}>{t('team:member_psy_profile')}</div>
                                        <Table
                                            tableData={state.fullProfileData.map(item => [
                                                item[0],
                                                item[1]
                                            ])}
                                            tableHeader={fpTableTile}
                                            addClasses={['striped']}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </Rodal>
    )
}
