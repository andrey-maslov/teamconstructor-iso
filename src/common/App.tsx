import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {SVGSource} from './components/common/media/svgflag/SVGFlag';
import {ToastProvider} from 'react-toast-notifications'

import './index.scss';

import PairCoopPage from './components/pages/pair-coop-page/PairCoopPage';
import TeamCoopPage from './components/pages/team-coop-page/TeamCoopPage';
import ErrorPage from './components/pages/error-page/ErrorPage';
import Modals from './components/common/modals/Modals';
import ScrollToTop from './components/common/layout/ScrollToTop';
import Footer from './components/common/layout/footer/Footer';
import Header from './components/common/layout/header/Header';

// import CookiesWarn from "./components/CommonComponents/Modals/CookiesWarn/CookiesWarn";

const App: React.FC = () => {

    return (
        <ToastProvider>
            <div className="app-wrapper">
                <Header/>
                <ScrollToTop/>
                <Switch>
                    <Route exact path="/" render={() => <PairCoopPage/>}/>
                    <Route exact path="/team" render={() => <TeamCoopPage/>}/>
                    <Route path="*" render={() => <ErrorPage/>}/>
                </Switch>
                <Footer/>
                <SVGSource/>
                <Modals/>
            </div>
        </ToastProvider>
    );
};

export default App;
