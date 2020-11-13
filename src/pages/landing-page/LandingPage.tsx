import React from 'react'
import Hero from './Hero/Hero'
import Background from './background/Background'
import Includes from './includes/Includes'
import Use from './use/Use'
import Prices from './prices/Prices'
import Faq from './faq/Faq'
import Auditory from './auditory/Auditory'

const LandingPage: React.FC = () => {

    return (
        <div className='landing'>
            <Hero />
            <Background />
            <Includes />
            <Auditory />
            <Use />
            <Prices />
            <Faq />
        </div>
    )
}

export default LandingPage
