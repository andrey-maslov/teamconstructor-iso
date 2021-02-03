import React, { useState, useEffect } from 'react'
import MobiNav from './nav/MobiNav'
import MobileNavToggle from './nav-toggle/NavToggle'
import { IHeaderProps } from '../../web/header/WebHeader'
import style from './mobi-header.module.scss'
import TopLogo from '../../common/layout/header/top-logo/TopLogo'
import { INavigation } from '../../web/header/nav/WebNav'
import { isBrowser } from '../../../helper/helper'
import LangSwitcherAlt from "../../common/buttons/lang-switcher-alt/LangSwitcherAlt";
import { IS_UNDER_CONSTR } from "../../../constants/constants";


const MobiHeader: React.FC<INavigation> = (props: IHeaderProps) => {

    const [isVisible, setVisible] = useState(false)

    useEffect(() => {
        if (isBrowser && isVisible) {
            document.body.classList.add('menu-opened')
        } else if (isBrowser && !isVisible) {
            document.body.classList.remove('menu-opened')
        }
    }, [isVisible])

    return (
        <header className={style.header}>
            <div className={style.bar}>
                <TopLogo />
                {!IS_UNDER_CONSTR
                    ? <MobileNavToggle handler={() => setVisible(!isVisible)} />
                    : <div><LangSwitcherAlt /></div>
                }
            </div>
            <MobiNav
                isOpened={isVisible}
                closeNav={() => setVisible(false)}
                {...props}
            />
        </header>
    )
}

export default MobiHeader
