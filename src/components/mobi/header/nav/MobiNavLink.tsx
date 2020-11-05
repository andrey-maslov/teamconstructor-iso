import style from "./mobi-nav.module.scss"
import { NavLink } from "react-router-dom"
import React from "react"

export interface INavigationLink {
    title: string
    path: string
    icon: React.ReactNode
    onClick: () => void
}

export const MobiNavLink = ({ title, path, icon, onClick }: INavigationLink) => (
    <li className={style.item} key={title} >
        <NavLink exact
                 className={`${style.link} nav-link`}
                 activeClassName={style.current}
                 to={path}
                 onClick={onClick}
        >
            {icon}{title}
        </NavLink>
    </li>
)