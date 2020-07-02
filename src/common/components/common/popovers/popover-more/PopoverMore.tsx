import React, { useState } from 'react';
import style from './popover-more.module.scss';
import ButtonMore from '../../buttons/button-more/ButtonMore';
import OutsideClickHandler from 'react-outside-click-handler';

interface PopoverMoreProps {
    data: any
}

const PopoverMore: React.FC<PopoverMoreProps> = ({data}) => {

    const [state, setState] = useState({
                                           isOpen: false,
                                       });

    const closeMore = () => {
        setState({...state, isOpen: false});
    };

    const btnMoreHandler = () => {
        if (state.isOpen) {
            closeMore();
        } else {
            setState({...state, isOpen: true});
        }
    };

    const outsideMoreHandler = () => {
        if (state.isOpen) {
            closeMore();
        }
    };


    return (
        <OutsideClickHandler onOutsideClick={outsideMoreHandler}>
            <div className={style.moreBtn}>
                <ButtonMore
                    handler={btnMoreHandler}
                    isOpened={state.isOpen}
                />
            </div>
            <div className={`${style.more} ${state.isOpen ? style.opened : ''}`}>
                {data.map((item: string, i: number) => <div className={style.item} key={i}>{item}</div>)}
            </div>
        </OutsideClickHandler>
    );
};

export default PopoverMore;