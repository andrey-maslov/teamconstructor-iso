import React from 'react'
import workBoard from '../../../assets/img/workboard.png'
import device from '../../../assets/img/device.png'
import workBoard2x from '../../../assets/img/workboard@2x.png'
import device2x from '../../../assets/img/device@2x.png'
import style from './consist.module.scss'
import RobotQuestion from "../../../components/common/media/robot-question/RobotQuestion"
import {useMediaPredicate} from 'react-media-hook'
import {useTranslation} from 'react-i18next'
import { FiExternalLink } from 'react-icons/fi'
import {TEST_URL} from "../../../constants/constants";
import {NavLink} from "react-router-dom";

const Consist: React.FC = () => {

    const {t} = useTranslation()
    const isMoby = useMediaPredicate('(max-width: 768px)')

    const testList: string[] = t('landing:consist.test_list', {returnObjects: true})
    const teamList: string[] = t('landing:consist.team_list', {returnObjects: true})

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('landing:consist.title')}</h2>

                <div className={`row between-sm middle-xs ${style.box}`}>
                    <div className="col-lg-5">
                        <div className={style.robot}>
                            <RobotQuestion/>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className={style.header}>
                            <h3 className={`section-subtitle`}>{t('landing:consist.unique_test')}</h3>
                            <p className={style.subtitle}>{t('landing:consist.test_desc')}</p>
                        </div>
                        <ul className={`${style.list} `}>
                            {testList.map((item, i) => <li className={style.item} key={`${i}`}>{item}</li>)}
                        </ul>
                        <a
                            href={TEST_URL}
                            className="btn btn-outlined-yellow"
                            target="_blank"
                            rel="noreferrer">
                            <FiExternalLink/>
                            {t('landing:cta.take_the_test_for_free')}
                        </a>
                    </div>
                </div>

                <div className={`row middle-sm  ${style.box}`}>
                    <div className="col-lg-5">
                        <div className={style.header}>
                            <h3 className={`section-subtitle`}>{t('landing:consist.team_building')}</h3>
                            <p className={style.subtitle}>{t('landing:consist.team_desc')}</p>
                        </div>
                        <ul className={`${style.list}`}>
                            {teamList.map((item, i) => <li className={style.item} key={`${i}`}>{item}</li>)}
                        </ul>
                        <NavLink to="/registration" className="btn btn-outlined-yellow">
                            {t('landing:cta.start_team_coop')}
                        </NavLink>
                    </div>

                    <div className="col-lg-7">
                        {!isMoby && <div className={`${style.teamImg}`}>
                            <img src={device} srcSet={`${device2x} 2x`} alt="mac book"/>
                            <div className={style.workboard}>
                                <img src={workBoard} srcSet={`${workBoard2x} 2x`} alt="work board"/>
                            </div>
                        </div>}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Consist