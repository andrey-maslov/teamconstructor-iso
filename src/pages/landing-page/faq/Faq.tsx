import React from 'react'
import style from './faq.module.scss'
import FaqItem from "./FaqItem";

const Faq: React.FC = () => {

    const faq: string[][] = [
        [
            'Какая методология использовалась построения системы расчетов?',
            'Научная основа: разработки Л.Н.Собчик (Теория ведущих тенденций); Р. Акофф, Ф. Эмери. (О целеустремленных системах.), У.Шутц (Теория межличностных отношений), а также исследования врожденных и приобретенных особенностей мозга.'
        ],
        [
            'где брались данные для построения модели?',
            'Данные для построения модели брались из многочисленных эспериментов, проведенных на реальных командах'
        ],
        [
            'вы жулики?',
            'нет, мы не жулики, наши расчеты основаны на ….'
        ],
        [
            'Ещще один интересный вопрос для массы?',
            'А это замечательный и развернеутый ответ на такой же замечательный и развернутый вопрос. В этом ответе рассмотрены все стороны вопроса и более не должно остаться никаких сомнений в нашей компетентности'
        ]
    ]

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
                <h2 className={`section-title ${style.title}`}>Часто задаваемые вопросы</h2>
                <div className="row">
                    <div className="col-md-6">
                        {odd.map((item, i) => (
                            <FaqItem
                                question={item[0]}
                                answer={item[1]}
                                key={`${i}`}
                            />
                        ))}
                    </div>
                    <div className="col-md-6">
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