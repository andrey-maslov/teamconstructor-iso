import React from 'react'
import style from './auditory.module.scss'
import hr from '../../../assets/img/hr_alt.png'
import hr2x from '../../../assets/img/hr_alt@2x.png'
import manager from '../../../assets/img/manager_alt.png'
import manager2x from '../../../assets/img/manager_alt@2x.png'

const Auditory: React.FC = () => {

    const texts = [
        {
            title: 'Руководителям подразделений',
            desc: 'формировать команды из подходящих друг другу людей либо под необходимые задачи с учетом специализации (продажи, аналитика, творчество, обеспечение качества и тд)',
            img: manager,
            img2x: manager2x,
        },
        {
            title: 'Специалистам по человеческим ресурсам',
            desc: 'узнать психологический профиль кандидата и его потенциальную совместимость с имеющейся командой',
            img: hr,
            img2x: hr2x,
        },
    ]


    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>Для кого этот сервис</h2>
                <div className="row around-sm">
                    {texts.map(item => (
                        <div key={item.title} className="col-md-6">
                            <div className={style.item}>
                                <div className={style.img}>
                                    <img src={item.img} srcSet={`${item.img2x} 2x`} alt={item.title} />
                                </div>
                                <div>
                                    <h3 className={style.header}>{item.title}</h3>
                                    <p className={style.desc}>{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Auditory