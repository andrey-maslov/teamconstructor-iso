import React from 'react'
import FetchedContent from '../../components/common/fetched-content/FetchedContent'


const ContentPage: React.FC<{ page: string }> = (props) => {


    return (
        <main className='section main'>
            <div className="container">
                <FetchedContent {...props} />
            </div>
        </main>
    )
}

export default ContentPage