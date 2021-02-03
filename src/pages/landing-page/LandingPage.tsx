import React from 'react'
import Hero from './Hero/Hero'
import Background from './background/Background'
import Consist from './consist/Consist'
import Use from './use/Use'
import Prices from '../../components/common/billing/prices/Prices'
import Faq from './faq/Faq'
import Auditory from './auditory/Auditory'
import ComingSoon from "../coming-soon-page/ComingSoon";
import { IS_UNDER_CONSTR } from "../../constants/constants";

const LandingPage: React.FC = () => {

    return (
        <div className='landing'>
            <Hero />
            <Background />
            <Consist />
            <Auditory />
            {!IS_UNDER_CONSTR && <Use />}
            {!IS_UNDER_CONSTR && <Prices />}
            <Faq />
            {IS_UNDER_CONSTR && <ComingSoon />}
        </div>
    )
}

export default LandingPage
