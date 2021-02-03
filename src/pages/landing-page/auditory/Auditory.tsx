import React from 'react'
import style from './auditory.module.scss'
import hr from '../../../assets/img/hr_alt.png'
import hr2x from '../../../assets/img/hr_alt@2x.png'
import manager from '../../../assets/img/manager_alt.png'
import manager2x from '../../../assets/img/manager_alt@2x.png'
import { useTranslation } from 'react-i18next'

const Auditory: React.FC = () => {

    const { t } = useTranslation()

    const images = [
        [manager, manager2x],
        [hr, hr2x]
    ]

    const roles: {title: string, desc: string}[] = t('landing:auditory.roles', { returnObjects: true })


    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('landing:auditory.title')}</h2>
                <div className="row around-sm">
                    {roles.map((item, i) => (
                        <div key={item.title} className="col-lg-6">
                            <div className={style.item}>
                                <div className={style.img}>
                                    <img src={images[i] ? images[i][0] : ''} srcSet={`${images[i] ? images[i][1] : ''} 2x`} alt={item.title} />
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