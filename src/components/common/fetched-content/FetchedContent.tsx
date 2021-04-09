import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import Loader from '../loaders/loader/Loader'
import { CONTENT_API } from '../../../constants/constants'

// get pages content by its ID on api.salary2.me
const pages = {
    'terms': 4,
    'cookie-policy': 2,
    'privacy-policy': 3,
    'rules-of-getting-and-cancelling': 5,
    'payment-rules': 6,
    'automatic-renewal-terms': 7,
    'requisites': 8,
}

const FetchedContent: React.FC<{ page: string }> = ({ page }) => {

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


    return <div className="content" dangerouslySetInnerHTML={{ __html: content }} />


    function fetchPageContent(page: string) {

        setLoading(true)

        axios(`${CONTENT_API}/content-blocks/${pages[page]}`)
            .then(res => setContent(res.data[`content_${lang}`]))
            .catch(err => {
                console.error(err)
                setContent('data is not available')
            })
            .finally(() => setLoading(false))
    }
}

export default FetchedContent