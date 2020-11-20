import React from 'react'
import { useTranslation } from "react-i18next"
import IEmailCollecor from "./email-collector/EmailCollector"
import SocialLinks from "../../components/common/social/social-links/SocialLinks"
import TopLogo from "../../components/common/layout/header/top-logo/TopLogo";


const ComingSoon: React.FC = () => {

    const { t: any } = useTranslation()

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
                            <p>Для записи на <strong>раннее тестирование сервиса Teamconstructor</strong> отправьте свой email с помощью формы ниже. Как только будет доступно использование функционала, мы вышлем вам приглашение</p>
                        </div>

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
