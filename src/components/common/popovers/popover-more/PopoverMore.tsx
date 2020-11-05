import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import style from './popover-more.module.scss'

interface PopoverMoreProps {
    data: string[]
}

const PopoverMore: React.FC<PopoverMoreProps> = ({data}) => {

    const [isOpen, setOpen] = useState(false);

    const outsideMoreHandler = () => {
        setOpen(false)
    };


    return (
        <OutsideClickHandler onOutsideClick={outsideMoreHandler}>
            <div className={style.moreBtn}>
                <button
                    onClick={() => setOpen(!isOpen)}
                    className={style.btn}
                    tabIndex={0}
                >
                    ?
                </button>
            </div>
            <div className={`${style.more} ${isOpen ? style.opened : ''}`}>
                {data.map((item: string, i: number) => <div className={style.item} key={i}>{item}</div>)}
            </div>
        </OutsideClickHandler>
    );
};

export default PopoverMore;