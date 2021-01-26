import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './use.module.scss'
import { FiExternalLink } from 'react-icons/fi'
import { TEST_URL } from "../../../constants/constants"
import CodeBox from "../../../components/common/Inputs/code-box/CodeBox"
import { useTranslation } from 'react-i18next'

const Use: React.FC = () => {

    const { t } = useTranslation()

    const content: {title: string, text: string}[] = t('landing:use.steps', { returnObjects: true })

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>{t('landing:use.title')}</h2>

                <div className={style.grid}>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>a.</span>{content[0].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[0].text }} />
                        <NavLink to="/registration"
                                 className={`btn btn-outlined ${style.accentBtn}`}>
                            {t('landing:cta.register')}
                        </NavLink>
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>b.</span>{content[1].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[1].text }} />
                        <a
                            href={TEST_URL}
                            className="btn btn-outlined"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FiExternalLink />
                            {t('landing:cta.take_test')}
                        </a>
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>c.</span>{content[2].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[2].text }} />
                        <CodeBox
                            content={`${TEST_URL}?lang=ru&open=true`}
                        />
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>d.</span>{content[3].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[3].text }} />
                        <NavLink to="/team" className="btn btn-outlined">
                            {t('landing:cta.go_to')}
                        </NavLink>
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>e.</span>{content[4].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[4].text }} />
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>f.</span>{content[5].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[5].text }} />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Use