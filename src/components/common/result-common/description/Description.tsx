import React from 'react'
import Indicator from "../indicator/Indicator"

interface DescriptionProps {
    teamProfile: { title: string, desc: string, status: number }
    data: { title: string, desc: string, status: number }[]
}

const Description: React.FC<DescriptionProps> = ({ teamProfile, data }) => {

    return (
        <div className="row">
            {teamProfile && <div className="indicator col-xl-12">
                <Indicator
                    title={teamProfile.title}
                    description={teamProfile.desc}
                    status={teamProfile.status}
                />
            </div>}

            {data.map((item, i) => {
                return item &&
                    <div key={i} className="indicator col-xl-6">
                        <Indicator
                            title={item.title}
                            description={item.desc}
                            status={item.status}
                        />
                    </div>
            })}
        </div>
    )
}

export default Description
