import React from 'react'
import { useTranslation } from 'react-i18next'
import style from './pay-providers.module.scss'
import providers_without_bg from '../../../../../public/img/providers_without_bg.png'
import providers_without_bg2x from '../../../../../public/img/providers_without_bg@2x.png'

const PayProviders: React.FC = () => {

    const { t } = useTranslation()

    return (
        <div className={style.wrapper}>
            <div className={style.providers}>
                <p className={style.title}>{t('common:pay_title')}</p>
                <img
                    srcSet={`${providers_without_bg2x} 2x, ${providers_without_bg2x} 3x`}
                    src={providers_without_bg}
                    alt="payment providers: visa, mastercard, belcard, apple pay, samsung pay" />
            </div>
        </div>
    )
}

export default PayProviders
