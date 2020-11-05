import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import style from './popover-user.module.scss'
import { FiUser, FiUserCheck, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { Popover } from '../Popover'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { globalStoreType } from '../../../../constants/types'
import ProjectList from "../../team-coop/project-list/ProjectList"

interface PopoverUserProps {
    logoutHandle: () => void
}

const PopoverUser: React.FC<PopoverUserProps> = ({ logoutHandle }) => {

    const [isOpen, setIsOpen] = useState(false)
    const { email } = useSelector((state: globalStoreType) => state.user)
    const { t } = useTranslation()

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

                <button
                    className={style.openBtn}
                    onClick={() => {setIsOpen(!isOpen)}}
                >
                    <FiUser />
                    <FiChevronDown />
                </button>

                <Popover isVisible={isOpen} className={`user-popover ${style.body}`}>
                    <div className={`${style.top} ${style.item}`}>
                        <FiUserCheck />
                        <span>{email}</span>
                    </div>

                    <div className={style.projects}>
                        <ProjectList />
                    </div>

                    <button className={style.item} onClick={logoutHandle}>
                        <FiLogOut />
                        <span>{t('common:buttons.logOut')}</span>
                    </button>
                </Popover>
            </div>
        </OutsideClickHandler>
    )
}

export default PopoverUser
