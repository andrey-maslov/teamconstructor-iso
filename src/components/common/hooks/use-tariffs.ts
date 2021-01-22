import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { IMembershipPlan } from "../../../constants/types";
import { fetchTariffsData } from "../../../actions/api/tariffsAPI";
import { SERVICE } from "../../../constants/constants";

export const useTariffs = (): IMembershipPlan[] => {

    const { t, i18n } = useTranslation()

    const tariffDescList = {
        0: {
            title: `${t('prices:free.title')}`,
            desc: `${t('prices:free.desc')}`,
            features: t('prices:free.features', { returnObjects: true })
        },
        3: {
            title: `${t('prices:paid.title')}`,
            desc: `${t('prices:paid.desc')}`,
            features: t('prices:paid.features', { returnObjects: true })
        },
        4: {
            title: `${t('prices:paid.title')}`,
            desc: `${t('prices:paid.desc')}`,
            features: t('prices:paid.features', { returnObjects: true })
        },
        5: {
            title: 'Promo',
            desc: 'Promo tariff',
            features: ['All free access']
        }
    }

    const basicPlan: IMembershipPlan = {
        id: 0,
        title: 'Free',
        service: SERVICE,
        price: 0,
        monthCount: 0,
        description: null,
        autoSearchCount: null
    }

    const [tariffs, setTariffs] = useState<IMembershipPlan[]>([basicPlan])

    // Get all services tariffs and filter teamconstructor tariffs
    useEffect(() => {
        fetchTariffsData().then((data: IMembershipPlan[] | number) => {
            if (Array.isArray(data)) {
                const list = data.filter((item: any) => item?.service === SERVICE)
                const mappedList = [basicPlan, ...list].map(item => {
                    return {
                        ...item,
                        title: tariffDescList[item.id].title,
                        description: tariffDescList[item.id].desc,
                        features: tariffDescList[item.id].features,
                    }
                })
                setTariffs(mappedList)
            } else {
                console.log('Error: ', data)
                setTariffs( [basicPlan])
            }
        })
    }, [i18n.language])

    return tariffs
}
