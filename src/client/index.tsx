import React, { Suspense } from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import index from '../common/store';
import App from '../common/App';
import Loader from '../common/components/common/loaders/loader/Loader';

import { useSSR } from 'react-i18next';
import '../i18n';

const BaseApp = () => {
    // @ts-ignore
    useSSR(window.initialI18nStore, window.initialLanguage);
    return (
        <Suspense fallback={<div className='section'><Loader/></div>}>
            <Provider store={index}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </Provider>
        </Suspense>
    );
};

hydrate(
    <BaseApp/>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}
