import React, {useEffect, useState} from 'react'
import Loader from "../../components/common/loaders/loader/Loader"
import axios from "axios";
import {CONTENT_API} from "../../constants/constants";


const ContentPage: React.FC<{ page: string }> = ({page}) => {

    const [content, setContent] = useState('')
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        fetchPageContent(page)
    }, [page])


    if (isLoading) {
        return <main className='flex-centered'><Loader/></main>
    }


    return (
        <main className='section main'>
            <div className="container">
                <div dangerouslySetInnerHTML={{__html: content}} />
            </div>
        </main>
    );

    function fetchPageContent(page: string) {

        setLoading(true)

        const pages = {
            'terms': 4,
            'cookie-policy': 2,
            'privacy-policy': 3
        }

        const lang = 'en'

        axios(`${CONTENT_API}/content-blocks/${pages[page]}`)
            .then(res => setContent(res.data[`content_${lang}`]))
            .catch(err => {
                console.error(err)
                setContent('data is not available')
            })
            .finally(() => setLoading(false))
    }
};

export default ContentPage;