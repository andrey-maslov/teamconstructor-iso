import React from 'react'
import Hero from "./Hero/Hero";
import Background from "./background/Background";
import Includes from "./includes/Includes";
import Use from "./use/Use";
import Prices from "./prices/Prices";

const LandingPage: React.FC = () => {

    return (
        <div className='landing'>
            <Hero />
            <Background />
            <Includes />
            <Use />
            <Prices />
        </div>
    )
}

export default LandingPage
