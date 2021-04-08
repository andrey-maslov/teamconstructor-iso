import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loader from '../../components/common/loaders/loader/Loader'
import axios from 'axios'
import { CONTENT_API } from '../../constants/constants'


const ContentPage: React.FC<{ page: string }> = ({ page }) => {

    const [content, setContent] = useState('')
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        fetchPageContent(page)
    }, [page, lang])


    if (isLoading) {
        return <main className='flex-centered'><Loader /></main>
    }


    return (
        <main className='section main'>
            <div className="container">
                <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </main>
    )

    function fetchPageContent(page: string) {

        setLoading(true)

        const pages = {
            'terms': 4,
            'cookie-policy': 2,
            'privacy-policy': 3,
            'rules-of-getting-and-cancelling': 5,
            'payment-rules': 6,
            'automatic-renewal-terms': 7,
        }

        axios(`${CONTENT_API}/content-blocks/${pages[page]}`)
            .then(res => setContent(res.data[`content_${lang}`]))
            .catch(err => {
                console.error(err)
                setContent('data is not available')
            })
            .finally(() => setLoading(false))
    }
}

export default ContentPage