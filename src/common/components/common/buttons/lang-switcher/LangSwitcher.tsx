import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import OutsideClickHandler from 'react-outside-click-handler';
import { fetchTerms } from '../../../../actions/actionCreator';
import { LANGS } from '../../../../../constants/constants';
import { SVGFlag } from '../../media/svgflag/SVGFlag';
import { Popover } from '../../popovers/Popover';
import {useTranslation} from "react-i18next";
import style from './lang-switcher.module.scss';

interface LangSwitcherProps {
    fetchTerms: (language: string) => {}
}

const LangSwitcher: React.FC<LangSwitcherProps> = ({fetchTerms}) => {

    const [isOpen, setIsOpen] = useState(false);

    const outsideClickHandler = () => {
        if (isOpen) {
            setIsOpen(false)
        }
    }

    const {t, i18n} = useTranslation();
    const currentLang = i18n.language;

    const changeLanguage = (lng: any) => {

        i18n.changeLanguage(lng)
            .then(res => {
                fetchTerms(lng);
                if (isOpen) {
                    setIsOpen(false)
                }
            })
    };

    const currLang = i18n.language;

    useEffect(() => {
        let lng = currentLang === 'ru' ? 'ru' : 'en'
        fetchTerms(lng);
    }, [])


    return (
        <OutsideClickHandler
            onOutsideClick={outsideClickHandler}
        >
            <div className={style.wrapper}>
                {/*<div*/}
                {/*    className={style.btn}*/}
                {/*    onClick={() => {*/}
                {/*        setIsOpen(!isOpen)*/}
                {/*    }}*/}
                {/*    suppressHydrationWarning={true}*/}
                {/*>*/}
                {/*    <SVGFlag id={currLang} tagClass={style.flag}/>*/}
                {/*    {currLang}*/}
                {/*</div>*/}

                <Popover isVisible={isOpen} className={`lang-popover ${style.popover}`}>
                    <ul className={style.links}>
                        {LANGS.map(lang => {
                            let activeClass = '';
                            if (lang[0] === currLang) {
                                activeClass = 'current';
                            }
                            return <li key={lang[0]} className={`${style.item} ${activeClass ? style[activeClass] : ''}`}>
                                <a className={style.switcher}
                                    href={`?lng=${lang[0]}`}
                                    // onClick={()=> {changeLanguage(lang)}}
                                >
                                    <SVGFlag id={lang[0]} tagClass={style.flag}/>
                                    <span>{lang[0]}</span>
                                </a>
                            </li>
                        })}
                    </ul>
                </Popover>
            </div>
        </OutsideClickHandler>
    );
}

interface LangSwitcherState {
    userData: {
        language: string
    }
}

export default connect((state: LangSwitcherState) => ({
    // currentLang: state.user.language
}), {fetchTerms})(LangSwitcher);