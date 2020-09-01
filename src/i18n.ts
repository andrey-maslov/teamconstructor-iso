import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import {LANGS, LANG_DEFAULT} from './constants/constants'

// import Cookie from "js-cookie"
//
// const userLang = Cookie.get('lang')
const languages = LANGS.map(item => item[0])

const options = {
    fallbackLng: LANG_DEFAULT,
    whitelist: languages,
    load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE
    // have a common namespace used around the full app
    ns: ['common', 'team', 'pair', '404'],
    defaultNS: 'common',

    saveMissing: true,
    debug: false,

    interpolation: {
        escapeValue: false, // not needed for react!!
        formatSeparator: ',',
        format: (value: any, format: string, lng: string) => {
            if (format === 'uppercase') return value.toUpperCase();
            return value;
        },
    },
    wait: process && !process.release,
};

type OptionsType = typeof options;

// for browser use http backend to load translations and browser lng detector
if (process && !process.release) {
    i18n
        .use(Backend)
        .use(initReactI18next)
        .use(LanguageDetector);
}

// initialize if not already initialized
if (!i18n.isInitialized) {
    // @ts-ignore
    i18n.init(options);
}

export default i18n;