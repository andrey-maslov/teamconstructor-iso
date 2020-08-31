import React from 'react'
import Indicator from "../indicator/Indicator"
import {GoRocket} from "react-icons/go"
import {AiOutlineProfile} from "react-icons/ai";

interface TeamDescriptionProps {
    teamProfile: string[] | null
    data: (string[] | null)[]
}

const TeamDescription: React.FC<TeamDescriptionProps> = ({teamProfile, data}) => {

    return (
        <div className="row">
            {teamProfile && <div className="indicator col-xl-12">
                <Indicator
                    title={teamProfile[0]}
                    description={teamProfile[1]}
                    icon={<AiOutlineProfile/>}
                />
            </div>}

            {data.slice(1).map((item, i) => {
                return item &&
                    <div key={i} className="indicator col-xl-6">
                        <Indicator
                            title={item[0]}
                            description={item[1]}
                        />
                    </div>
            })}
        </div>
    );
}

export default TeamDescription;