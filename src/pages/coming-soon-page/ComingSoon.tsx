import React from 'react'
import { useTranslation } from "react-i18next"
import IEmailCollecor from "./email-collector/EmailCollector"
import SocialLinks from "../../components/common/social/social-links/SocialLinks"
import { useMediaPredicate } from "react-media-hook"
import RobotWide from "../../components/common/media/robot-wide/RobotWide"
import TopLogo from "../../components/common/layout/header/top-logo/TopLogo";


const ComingSoon: React.FC = () => {

    const { t: any } = useTranslation()
    const isMoby = useMediaPredicate('(max-width: 768px)')

    return (
        <main className='main coming-soon-page'>
            <div className="container">
                <div className="row center-xs">
                    <div className="col-xl-8">

                        <div className="logo">
                            <TopLogo />
                        </div>

                        <div className="headline">
                            <h1>Наш сервис скоро будет готов</h1>
                            <p>Для записи на раннее тестирование отправьте свой email с помощью формы ниже</p>
                        </div>

                        {/*{!isMoby && <div className="robot">*/}
                        {/*    <RobotWide />*/}
                        {/*</div>}*/}

                        <div className="email-collector">
                            <IEmailCollecor />
                        </div>

                        <div className="social-links">
                            <SocialLinks />
                        </div>
                    </div>

                </div>

            </div>
        </main>
    )
}

export default ComingSoon
