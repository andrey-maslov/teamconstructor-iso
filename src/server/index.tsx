/* eslint-disable import/no-dynamic-require */
import React from 'react';
import { StaticRouter, matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import index from '../common/store/index';

import express from 'express';
import path from 'path';
import fs from 'fs';
import { LANGS, LANG_DEFAULT, ROUTES } from '../constants/constants';
import { I18nextProvider } from 'react-i18next';
import Backend from 'i18next-fs-backend';
import i18n from '../i18n';
import App from '../common/App';

import { stripCountry } from '../helper/helper';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: any) => path.resolve(appDirectory, relativePath);
// const appSrc = resolveApp('src');
// const appPublic = resolveApp('public');

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);

const i18nextMiddleware = require('i18next-http-middleware');

const server = express();

i18n
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init(
        {
            debug: false,
            preload: ['en', 'ru'],
            // @ts-ignore
            whitelist: LANGS,
            ns: ['common', 'questions'],
            defaultNS: 'common',
            backend: {
                loadPath: `${process.env.RAZZLE_PUBLIC_DIR!}/locales/{{lng}}/{{ns}}.json`,
                addPath: `${process.env.RAZZLE_PUBLIC_DIR!}/locales/{{lng}}/{{ns}}.missing.json`,
            },
        },
        () => {
            server
                .disable('x-powered-by')
                .use(i18nextMiddleware.handle(i18n))
                .use('/locales', express.static(`${process.env.RAZZLE_PUBLIC_DIR!}/locales`))
                .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
                .get('/*', (req, res) => {
                    const context = {};

                    const markup = renderToString(
                        // @ts-ignore
                        <I18nextProvider i18n={req.i18n}>
                            <Provider store={index}>
                                <StaticRouter context={context} location={req.url}>
                                    <App/>
                                </StaticRouter>
                            </Provider>
                        </I18nextProvider>,
                    );

                    // @ts-ignore
                    const {url} = context;
                    if (url) {
                        res.redirect(url);
                    } else {
                        const initialI18nStore = {};
                        // @ts-ignore
                        req.i18n.languages.forEach(l => {
                            // @ts-ignore
                            initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
                        });
                        // @ts-ignore
                        const initialLanguage = req.i18n.language;
                        const initLang: string = stripCountry(initialLanguage) || LANG_DEFAULT;

                        const indexHTML: string = `<!doctype html>
                                            <html lang="${initLang}">
                                            <head>
                                                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                                <meta charSet='utf-8' />
                                                <title>${initialI18nStore[initLang].common.meta.title}</title>
                                                <meta name="description" content="${initialI18nStore[initLang].common.meta.title}">
                                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                                ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
                                                <script src="${assets.client.js}" defer></script>
                                                <script>
                                                  window.initialI18nStore = JSON.parse('${JSON.stringify(initialI18nStore)}');
                                                  window.initialLanguage = '${initLang}';
                                                </script>
                                            </head>
                                            <body>
                                                <div id="root">${markup}</div>
                                            </body>
                                        </html>`;

                        if (!ROUTES.includes(req.path)) {
                            res.status(404).send(indexHTML);
                        }

                        res.status(200).send(indexHTML);
                    }
                });
        },
    );

export default server;






