import React from 'react'
import { useTranslation } from "react-i18next"
import IEmailCollecor from "./email-collector/EmailCollector"
import SocialLinks from "../../components/common/social/social-links/SocialLinks"
import { useMediaPredicate } from "react-media-hook"
import RobotWide from "../../components/common/media/robot-wide/RobotWide"


const ComingSoon: React.FC = () => {

    const { t: any } = useTranslation()
    const isMoby = useMediaPredicate('(max-width: 768px)')

    return (
        <main className='main coming-soon-page'>
            <div className="container">
                <div className="row center-xs">
                    <div className="col-xl-8">
                        <div className="headline">
                            <h1>Наш сервис скоро будет готов</h1>
                            <p>Для записи на раннее тестирование отправьте свой email с помощью формы ниже</p>
                        </div>
                        <div className="row between-xs bottom-md">
                            <div className="col-lg-4">
                                <div className="email-collector">
                                    <IEmailCollecor />
                                </div>
                                <div className="social-links">
                                    <h4 className="social-links-title">Наши социальные сети</h4>
                                    <SocialLinks />
                                </div>
                            </div>

                            {!isMoby && <div className="robot">
                                <RobotWide />
                            </div>}
                        </div>
                    </div>

                </div>

            </div>
        </main>
    )
}

export default ComingSoon
