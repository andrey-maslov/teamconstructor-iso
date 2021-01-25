import React, { useState } from 'react'
import style from './faq.module.scss'

interface IFaqItem {
    question: string,
    answer: string
}

const FaqItem: React.FC<IFaqItem> = ({ question, answer }) => {

    const [isOpen, setOpen] = useState(false)

    return (
        <div className={`${style.item} ${isOpen ? style.opened : ''}`}>
            <button
                onClick={() => setOpen(!isOpen)}
                className={style.q}
                aria-expanded={!isOpen}
            >
                <span>{question}</span>
            </button>
            <div className={style.a}>
                <p>{answer}</p>
            </div>
            <div className={style.icon}>
                <span /><span />
            </div>
        </div>
    )
}

export default FaqItem