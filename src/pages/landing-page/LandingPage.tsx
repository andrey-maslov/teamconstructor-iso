import React from 'react'
import Hero from "./Hero/Hero";
import Background from "./background/Background";

const LandingPage: React.FC = () => {

    return (
        <div className='landing'>
            <Hero />
            <Background />
        </div>
    )
}

export default LandingPage
