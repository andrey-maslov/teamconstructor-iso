import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import index from '../store/index'
import express from 'express'
import path from 'path'
import fs from 'fs'
import { LANGS, LANG_DEFAULT, ROUTES, SITE_TITLE, HOST } from '../constants/constants'
import { I18nextProvider } from 'react-i18next'
import Backend from 'i18next-fs-backend'
import i18n from '../i18n'
import App from '../App'
import { stripCountry } from '../helper/helper'
import { maintainRedirect } from "./maintainRedirect";
import { saveEmails } from "./saveEmails";
import { getCookie } from "../helper/cookie";

const cookieParser = require('cookie-parser')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const i18nextMiddleware = require('i18next-http-middleware')

const languages = LANGS.map(item => item[0])
const publicDir = process.env.RAZZLE_PUBLIC_DIR || 'public'

const server = express()

i18n
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init(
        {
            debug: false,
            preload: [ 'en', 'ru' ],
            whitelist: languages,
            ns: [ 'common', 'team', 'pair', '404', 'landing', 'prices' ],
            defaultNS: 'common',
            backend: {
                loadPath: `${ publicDir }/locales/{{lng}}/{{ns}}.json`,
                addPath: `${ publicDir }/locales/{{lng}}/{{ns}}.missing.json`,
            },
        },
        () => {
            server
                .disable('x-powered-by')
                .use(i18nextMiddleware.handle(i18n))
                .use(cookieParser())
                .use('/locales', express.static(`${ publicDir }/locales`))
                .use(express.static(publicDir))
                .use('/save-email', saveEmails)
                // .use(maintainRedirect)
                .get([ '/team', '/profile', '/subscriptions' ], (req, res, next) => {
                    if (!req.cookies.token) {
                        res.redirect('/')
                    } else {
                        next()
                    }
                })
                .get([ '/signin', '/registration' ], (req, res, next) => {
                    if (req.cookies.token) {
                        res.redirect('/')
                    } else {
                        next()
                    }
                })
                .get('/*', (req, res) => {
                    const context = {}

                    const markup = renderToString(
                        <I18nextProvider i18n={ req.i18n }>
                            <Provider store={ index }>
                                <StaticRouter context={ context } location={ req.url }>
                                    <App />
                                </StaticRouter>
                            </Provider>
                        </I18nextProvider>,
                    )

                    const { url } = context
                    if (url) {
                        res.redirect(url)
                    } else {
                        const initialI18nStore = {}
                        req.i18n.languages.forEach(l => {
                            initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
                        });
                        const cookieConsent = getCookie('cookie-consent', req)
                        const initialLanguage = req.i18n.language
                        const initLang = stripCountry(initialLanguage) || LANG_DEFAULT;

                        const indexHTML = `<!doctype html>
                                            <html lang="${ initLang }">
                                            <head>
                                                
                                                <!-- Global site tag (gtag.js) - Google Analytics -->
                                                <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZVBW3DNY8K"></script>
                                                <script>
                                                  window.dataLayer = window.dataLayer || [];
                                                  function gtag(){dataLayer.push(arguments);}
                                                  gtag('js', new Date());
                                                
                                                  gtag('config', 'G-ZVBW3DNY8K');
                                                </script>
                                                
                                                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                                <meta charSet='utf-8' />
                                                <meta name="description" content="${ initialI18nStore[initLang].landing && initialI18nStore[initLang].landing.meta.description }">
                                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                                <title>${ initialI18nStore[initLang].landing && initialI18nStore[initLang].landing.meta.title }</title>
                                                ${ assets.client.css ? `<link rel="stylesheet" href="${ assets.client.css }">` : '' }
                                                
                                                <link rel="manifest" href="/manifest.json">
                                                
                                                <meta property="og:site_name" content="${ SITE_TITLE }" />
                                                <meta property="og:type" content="website" />
                                                <meta property="og:url" content="${ HOST }" />
                                                <meta property="og:title" content="${ initialI18nStore[initLang].landing && initialI18nStore[initLang].landing.meta.title }" />
                                                <meta property="og:description" content="${ initialI18nStore[initLang].landing && initialI18nStore[initLang].landing.meta.description }" />
                                                <meta property="og:image" content="${ HOST }/img/default.jpg" />
                                                <meta property="og:locale" content="${ initLang }" />
                                                <meta name="twitter:card" content="summary_large_image" />
                                                <meta name="twitter:title" content="${ initialI18nStore[initLang].landing && initialI18nStore[initLang].landing.meta.title }" />
                                                <meta name="twitter:description" content="${ initialI18nStore[initLang].landing && initialI18nStore[initLang].landing.meta.description }" />
                                                <meta name="twitter:site" content="${ SITE_TITLE }" />
                                                <meta name="twitter:url" content="${ HOST }" />
                                                <meta name="twitter:image" content="${ HOST }/img/default.jpg" />
                                                <meta name="theme-color" content="#1C1E23" />
                                                
                                                <script src="${ assets.client.js }" defer></script>
                                                <script>
                                                  window.initialI18nStore = JSON.parse('${ JSON.stringify(initialI18nStore) }');
                                                  window.initialLanguage = '${ initLang }';
                                                </script>
                                            </head>
                                            <body style="background-color: #1C1E23" class=${ cookieConsent ? 'cookie-consented' : '' }>
                                                <div id="root">${ markup }</div>
                                            </body>
                                        </html>`;

                        if (!Object.keys(ROUTES).includes(req.path)) {
                            res.status(404).send(indexHTML)
                        } else {
                            res.status(200).send(indexHTML)
                        }
                    }
                })
        },
    )

export default server
