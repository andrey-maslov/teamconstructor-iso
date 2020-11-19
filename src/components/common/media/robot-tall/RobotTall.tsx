import React from 'react';
import style from './robot-tall.module.scss';

const RobotTall = () => {

    return (
        <div className={style.robot}>
            <div className={`${style.arm} ${style.leftArm}`}>
                <div className={style.shoulder}/>
                <div className={`${style.handWrap} hand-anim`}>
                    <div className={style.cubit}/>
                    <div className={style.hand}/>
                </div>
            </div>
            <div className={style.center}>
                <div className={style.top}>
                    <div className={`${style.antenna} antenna1`}>
                        <div className={style.apex}/>
                        <div className={style.vertical}/>
                    </div>
                    <div className={`${style.antenna} antenna2`}>
                        <div className={style.apex}/>
                        <div className={style.vertical}/>
                    </div>
                </div>
                <div className={style.head}>
                    <div className={style.picTop}>
                        <div/>
                        <div/>
                    </div>
                    <div className={style.picBottom}>
                        <div/>
                        <div/>
                    </div>
                    <div className={style.leftPart}/>
                    <div className={style.rightPart}/>
                    <div className={`${style.eye} eye-anim`}/>
                    <div className={style.mouth}/>
                </div>
                <div className={style.bottom}>
                    <div className={style.body}/>
                    <div className={style.legs}>
                        <div className={style.leg}>
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                        <div className={style.leg}>
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.arm} ${style.rightArm}`}>
                <div className={style.shoulder}/>
                <div className={`${style.handWrap} hand-anim`}>
                    <div className={style.cubit}/>
                    <div className={style.hand}/>
                </div>
            </div>
        </div>
    );
}

export default RobotTall;