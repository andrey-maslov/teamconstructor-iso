import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import OutsideClickHandler from 'react-outside-click-handler';
import { fetchTerms } from '../../../../actions/actionCreator';
import { LANGS } from '../../../../../constants/constants';
import { Popover } from '../../popovers/Popover';
import style from './lang-switcher-alt.module.scss';
import {useTranslation} from "react-i18next";
import {stripCountry} from "../../../../../helper/helper";

const LangSwitcherAlt: React.FC = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const {i18n} = useTranslation();

    const currentLang = stripCountry(i18n.language);
    const currentLangLabel = LANGS.filter(item => item[0] === currentLang)[0][1];

    const outsideClickHandler = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    }

    const changeLanguage = (lng: any) => {

        i18n.changeLanguage(lng)
            .then(res => {
                dispatch(fetchTerms(lng));
                if (isOpen) {
                    setIsOpen(false)
                }
            })
    };

    useEffect(() => {
        fetchTerms(currentLang);
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
                            let activeClass = '';
                            if (lang[0] === currentLang) {
                                activeClass = 'current';
                            }
                            return <li key={lang[0]} className={`${style.item} ${activeClass ? style[activeClass] : ''}`}>
                                <a className={style.switcher}
                                   // href={`?lng=${lang[0]}`}
                                    onClick={()=> {changeLanguage(lang[0])}}
                                >
                                    {lang[1]}
                                </a>
                            </li>
                        })}
                    </ul>
                </Popover>
            </div>
        </OutsideClickHandler>
    );
}

export default LangSwitcherAlt;