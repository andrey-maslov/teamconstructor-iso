import React from 'react'
import { FaFacebookF, FaLinkedinIn, FaTelegramPlane } from 'react-icons/fa'
import style from './links.module.scss'

export interface ISocialLink {
    title: string
    url: string
    icon: React.ReactNode
}

const links: ISocialLink[] = [
    {
        title: 'facebook',
        url: 'https://www.facebook.com/CTI.startup',
        icon: <FaFacebookF />
    },

    {
        title: 'linkedin',
        url: 'https://www.linkedin.com/company/cti-startup',
        icon: <FaLinkedinIn />
    },

    {
        title: 'telegram',
        url: 'https://t.me/necodernotes',
        icon: <FaTelegramPlane />
    },
]

const SocialLinks: React.FC = () => {

    return (
        <ul className={style.list}>
            {links.map(link => (
                <li className={style.item} key={link.title}>
                    <a
                        href={link.url}
                        className={style.link}
                        target="_blank" rel="noopener noreferrer"
                        aria-label={link.title}
                    >
                        {link.icon}
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default SocialLinks
