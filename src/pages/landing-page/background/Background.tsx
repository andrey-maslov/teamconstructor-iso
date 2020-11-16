import React from 'react'
import style from './background.module.scss'
import { FiArrowDownRight } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const Background: React.FC = () => {

    const {t} = useTranslation()

    const problems: string[] = t('landing:background.problems_list', {returnObjects: true})
    const solutions: string[] = t('landing:background.solutions_list', {returnObjects: true})

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title`}>{t('landing:background.title')}</h2>
                <div className="row between-sm">
                    <div className="col-xl-5 col-lg-6">
                        <h3 className={`section-subtitle`}>{t('landing:background.problems')}</h3>
                        <ul className={`${style.list} marker-square`}>
                            {problems.map((item, i) => <li className={style.item} key={`${i}`}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="col-xl-5 col-lg-6">
                        <div className={style.solution}>
                            <FiArrowDownRight />
                            <h3 className={`section-subtitle`}>{t('landing:background.solution')}</h3>
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
