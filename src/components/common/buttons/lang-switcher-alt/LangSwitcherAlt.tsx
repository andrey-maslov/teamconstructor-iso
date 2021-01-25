import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler'
import { fetchContent, fetchTerms } from '../../../../actions/actionCreator'
import { LANGS } from '../../../../constants/constants'
import { Popover } from '../../popovers/Popover'
import style from './lang-switcher-alt.module.scss'
import { useTranslation } from 'react-i18next'
import { isBrowser, stripCountry } from '../../../../helper/helper'
import Cookie from 'js-cookie'

const LangSwitcherAlt: React.FC = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const { i18n, t } = useTranslation()

    const currentLang = stripCountry(i18n.language);
    const currentLangLabel = LANGS.filter(item => item[0] === currentLang)[0][1];

    const outsideClickHandler = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    }

    const changeLanguage = (lng: any) => {

        i18n.changeLanguage(lng)
            .then(() => {
                Cookie.set("i18next", lng)
                dispatch(fetchTerms(lng))
                dispatch(fetchContent(lng))
                // localizeMeta(lng)
                if (isOpen) {
                    setIsOpen(false)
                }
            })
    };

    useEffect(() => {
        dispatch(fetchTerms(currentLang))
        dispatch(fetchContent(currentLang))
    }, [])

    return (
        <OutsideClickHandler
            onOutsideClick={outsideClickHandler}
        >
            <div className={style.wrapper}>
                <button
                    className={style.btn}
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                    suppressHydrationWarning={true}
                >
                    {currentLangLabel}

                </button>

                <Popover isVisible={isOpen} className={`lang-popover-alt ${style.popover}`}>
                    <ul className={style.links}>
                        {LANGS.map(lang => {
                            let activeClass = ''
                            if (lang[0] === currentLang) {
                                activeClass = 'current'
                            }
                            return (
                                <li key={lang[0]}
                                    className={`${style.item} ${activeClass ? style[activeClass] : ''}`}
                                >
                                    <button className={style.switcher}
                                        // href={`?lng=${lang[0]}`}
                                            onClick={() => {
                                                changeLanguage(lang[0])
                                            }}
                                    >
                                        {lang[1]}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </Popover>
            </div>
        </OutsideClickHandler>
    )

    function localizeMeta(lang: string) {
        if (isBrowser) {
            document.title = t('common:meta.title')
            const descEl = document.querySelector('meta[name="description"]')
            if (descEl) {
                descEl.setAttribute('content', t('common:meta.description'))
            }
        } else {
            console.log('server')
        }
    }
}

export default LangSwitcherAlt
