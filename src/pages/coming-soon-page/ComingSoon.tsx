import React from 'react'
import { useTranslation } from "react-i18next"
import IEmailCollecor from "./email-collector/EmailCollector"
import SocialLinks from "../../components/common/social/social-links/SocialLinks"
import style from "./coming-soon.module.scss";


const ComingSoon: React.FC = () => {

    const { t } = useTranslation()

    return (
        <section className={`${style.section} section`}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>
                    {t('landing:comingSoon.title')}
                </h2>

                <div className="row">
                    <div className="col-lg-6">
                        <div className={style.headline}>
                            <p dangerouslySetInnerHTML={{__html: `${t('landing:comingSoon.desc')}`}}/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className={style.email}>
                            <IEmailCollecor />
                        </div>
                    </div>
                </div>
                <div className={style.social}>
                    <h3>{t('landing:comingSoon.join_in_social')}</h3>
                    <SocialLinks />
                </div>
            </div>
        </section>
    )
}

export default ComingSoon
