import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SVGSource } from './components/common/media/svgflag/SVGFlag';

import './index.scss';

import ComparePage from './components/pages/compare-page/ComparePage';
import ErrorPage from './components/pages/error-page/ErrorPage';
import Modals from './components/common/modals/Modals';
import ScrollToTop from './components/common/layout/ScrollToTop';
import Footer from './components/common/layout/footer/Footer';
import Header from './components/common/layout/header/Header';

// import CookiesWarn from "./components/CommonComponents/Modals/CookiesWarn/CookiesWarn";

const App: React.FC = () => {

    return (
        <div className="app-wrapper">
            <Header/>
            <ScrollToTop/>
            <Switch>
                <Route exact path="/" render={() => <ComparePage/>}/>te
                <Route path="*" render={() => <ErrorPage/>}/>
            </Switch>
            <Footer/>
            <SVGSource/>
            <Modals/>
        </div>
    );
};

export default App;
