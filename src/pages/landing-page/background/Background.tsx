import React from 'react'
import style from './background.module.scss'
import { FiArrowDownRight } from 'react-icons/fi'

const Background: React.FC = () => {

    const problems: string[] = [
        'Менеджер формирует команду без учета психологических особенностей членов команды. Это зачастую приводит к внутрикомандным конфликтам, снижению производительности эффективности и риску ухода сотрудников.',
        'Нехватка людей с необходимыми софт скиллами для эффективного решения необходимых задач с учетом специализации команды, например, продажи, разработка (требуются работники с разным типом характера, психологическими портретами)',
        'Сложно выбрать правильного кандидата в команду. Необходимо учитывать не только технические навыки, но и психологические особенности кандидата'
    ]

    const solutions: string[] = [
        'Мы даем понятный инструмент для решения этих задач - <strong>TEAM CONSTRUCTOR</strong>',
        'Каждый пользователь должен пройти небольшой тест и дальше все расчеты внутрикомандного взаимодействия мы берем на себя.',
    ]

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title`}>Предпосылки</h2>
                <div className="row between-sm">
                    <div className="col-xl-5 col-lg-6">
                        <h3 className={`section-subtitle`}>Проблемы</h3>
                        <ul className={`${style.list} marker-square`}>
                            {problems.map((item, i) => <li className={style.item} key={`${i}`}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="col-xl-5 col-lg-6">
                        <div className={style.solution}>
                            <FiArrowDownRight />
                            <h3 className={`section-subtitle`}>Решение</h3>
                            {solutions.map((item, i) => (
                                <p
                                    className={style.itemS}
                                    dangerouslySetInnerHTML={{ __html: item }}
                                    key={`${i}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Background