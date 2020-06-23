import React from 'react';
import {FiChevronDown} from "react-icons/fi";
import style from './button-more.module.scss';

interface ButtonMoreProps {
    isOpened: boolean
    handler: () => void
}

const ButtonMore: React.FC<ButtonMoreProps> = ({isOpened, handler}) => {

    return (
        <button onClick={handler} className={`${style.btn} ${isOpened ? style.opened : ''}`} tabIndex={0}>
            <FiChevronDown/>
        </button>
    );
}

export default ButtonMore;