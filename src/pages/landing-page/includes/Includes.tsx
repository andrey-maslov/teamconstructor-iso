import React from 'react'
import testImg from '../../../assets/img/tc-logo-bw.png'
import workBoard from '../../../assets/img/workboard.png'
import device from '../../../assets/img/device.png'
import workBoard2x from '../../../assets/img/workboard@2x.png'
import device2x from '../../../assets/img/device@2x.png'
import style from './includes.module.scss'
import RobotQuestion from "../../../components/common/media/robot-question/RobotQuestion";

const Includes: React.FC = () => {

    const testList: string[] = [
        'Состоит из 75 вопросов, прохождение занимает в среднем 15 минут',
        'Научная основа: разработки Л.Н.Собчик (Теория ведущих тенденций); Р. Акофф, Ф. Эмери. (О целеустремленных системах.), У.Шутц (Теория межличностных отношений), а также исследования врожденных и приобретенных особенностей мозга. ',
        'Сохраняет высокую точность, при этом удобен для быстрого прохождения',
        'Кросс-культурен, понятен для любых возрастов в любой среде на любом языке',
        'Результат обработан и закодирован, удобен для сохранения и передачи между сервисами',
    ]

    const teamList: string[] = [
        'Определить неформального лидера в команде',
        'Понять уровень взаимопонимания и эффективности командного взаимодействия',
        'Определить тех, с кем или без кого команда будет взаимодействовать эффективнее',
        'Понять насколько хорошо тот или иной кандидат вольется в команду с точки зрения микроклимата коллектива',
        'Создавать команды для решения конкретных задач (продажи, сервис, контроль качества и т.п.)',
    ]

    return (
        <section className={style.section}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>Что включает в себя сервис</h2>

                <div className={`row between-sm middle-xs ${style.box}`}>
                    <div className="col-lg-5">
                        <RobotQuestion />
                    </div>

                    <div className="col-lg-6">
                        <div className={style.header}>
                            <h3 className={`section-subtitle`}>Уникальный тест</h3>
                            <p className={style.subtitle}>
                                Пройдя наш тест, пользователь получает<br />
                                подробное подробное описание своего психологического портрета
                            </p>
                        </div>
                        <ul className={`${style.list} `}>
                            {testList.map((item, i) => <li className={style.item} key={`${i}`}>{item}</li>)}
                        </ul>
                    </div>
                </div>

                <div className={`row between-sm middle-xs ${style.box}`}>
                    <div className="col-lg-6">
                        <div className={style.header}>
                            <h3 className={`section-subtitle`}>Формирование команды</h3>
                            <p className={style.subtitle}>
                                Имея результаты тестов разных людей, можно<br />
                                прогнозировать взаимодействие между ними, в частности
                            </p>
                        </div>
                        <ul className={`${style.list}`}>
                            {teamList.map((item, i) => <li className={style.item} key={`${i}`}>{item}</li>)}
                        </ul>
                    </div>

                    <div className="col-lg-5">
                        <div className={`${style.teamImg}`}>
                            <img src={device} srcSet={`${device2x} 2x`} alt="mac book" />
                            <div className={style.workboard}>
                                <img src={workBoard} srcSet={`${workBoard2x} 2x`} alt="work board" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Includes