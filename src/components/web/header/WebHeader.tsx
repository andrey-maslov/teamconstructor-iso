import React from 'react'
import TopLogo from '../../common/layout/header/top-logo/TopLogo'
import WebNav from './nav/WebNav'
import style from './web-header.module.scss'
import { INavRoute } from '../../../constants/types'
import { IS_UNDER_CONSTR } from "../../../constants/constants";

export interface IHeaderProps {
    isLoggedIn: boolean
    handleLogoutBtn: () => void
    userEmail: string
    routes: INavRoute[]
}

const WebHeader: React.FC<IHeaderProps> = (props) => {

    return (
        <header className={`${style.header} header`}>
            <div className="container-wide">
                <nav className={style.bar}>
                    <TopLogo />
                    {!IS_UNDER_CONSTR && <WebNav {...props} />}
                </nav>
            </div>
        </header>
    )
}

export default WebHeader
