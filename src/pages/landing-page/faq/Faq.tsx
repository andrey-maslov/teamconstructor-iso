import React from 'react'
import style from './faq.module.scss'
import FaqItem from './FaqItem'
import { useTranslation } from 'react-i18next'

const Faq: React.FC = () => {

    const { t } = useTranslation()

    const faq: string[][] = t('landing:faq.faq_list', { returnObjects: true })

    const odd: string[][] = []
    const even: string[][] = []

    faq.forEach((item, i) => {
        if (i % 2 !== 0) {
            odd.push(item)
        } else {
            even.push(item)
        }
    })


    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('landing:faq.title')}</h2>
                <div className="row">
                    <div className="col-lg-6">
                        {odd.map((item, i) => (
                            <FaqItem
                                question={item[0]}
                                answer={item[1]}
                                key={`${i}`}
                            />
                        ))}
                    </div>
                    <div className="col-lg-6">
                        {even.map((item, i) => (
                            <FaqItem
                                question={item[0]}
                                answer={item[1]}
                                key={`${i}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Faq