import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import style from "./popover-user.module.scss";
import {FiUser, FiUserCheck, FiLogOut, FiChevronDown, FiStar} from "react-icons/fi";
import {Popover} from "../Popover";
import OutsideClickHandler from 'react-outside-click-handler';

interface PopoverUserProps {
    userEmail: string
    logoutHandle: () => void
}

const PopoverUser: React.FC<PopoverUserProps> = ({userEmail, logoutHandle}) => {

    const [isOpen, setIsOpen] = useState(false);

    const outsideClickHandler = () => {
        if (isOpen) {
             setIsOpen(false)
        }
    }

    return (
        <OutsideClickHandler
            onOutsideClick={outsideClickHandler}
        >
            <div className={style.wrapper}>

                <button className={style.profile} onClick={() => {
                    setIsOpen(!isOpen)
                }}>
                    <FiUser/>
                    <FiChevronDown/>
                </button>

                <Popover isVisible={isOpen} className='user-popover'>
                    <ul className={style.links}>
                        <li>
                        <span className={`${style.item} ${style.creds}`}>
                            <FiUserCheck/>
                            <span>{userEmail}</span>
                        </span>
                        </li>
                    </ul>

                    <ul className={style.links}>
                        <li>
                        <span className={style.item}>
                            <FiStar/>
                            <span>My subscription</span>
                        </span>
                        </li>
                        <li>
                        <span className={style.item} onClick={logoutHandle}>
                            <FiLogOut/>
                            <span>Logout</span>
                        </span>
                        </li>
                    </ul>
                </Popover>
            </div>
        </OutsideClickHandler>
    );
}

export default PopoverUser;