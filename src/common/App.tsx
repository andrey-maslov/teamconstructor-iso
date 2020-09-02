import React from 'react'
import {Route, Switch, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {ToastProvider} from 'react-toast-notifications'
import {ROUTES} from '../constants/constants'

import './index.scss'

import PairCoopPage from './components/pages/pair-coop-page/PairCoopPage'
import TeamCoopPage from './components/pages/team-coop-page/TeamCoopPage'
import ErrorPage from './components/pages/error-page/ErrorPage'
import Modals from './components/common/modals/Modals'
import ScrollToTop from './components/common/layout/ScrollToTop'
import Footer from './components/common/layout/footer/Footer'
import Header from './components/common/layout/header/Header'
import ContentPage from "./components/pages/content-page/ContentPage"

// import CookiesWarn from "./components/CommonComponents/Modals/CookiesWarn/CookiesWarn";

const App: React.FC = () => {

    const {pathname} = useLocation()
    const {isLoggedIn} = useSelector((state: any) => state.userData)

    return (
        <ToastProvider>
            <div className={`app-wrapper ${getPageClass(pathname)} ${isLoggedIn ? 'authorized' : 'unauthorized'}`}>
                <Header/>
                <ScrollToTop/>
                <Switch>
                    <Route exact path="/" render={() => <PairCoopPage/>}/>
                    <Route exact path="/team" render={() => <TeamCoopPage/>}/>
                    <Route exact path="/cookie-policy" render={() => <ContentPage page={'cookie-policy'} />}/>
                    <Route exact path="/privacy-policy" render={() => <ContentPage page={'privacy-policy'} />}/>
                    <Route exact path="/terms" render={() => <ContentPage page={'terms'} />}/>
                    <Route path="*" render={() => <ErrorPage/>}/>
                </Switch>
                <Footer/>
                <Modals/>
            </div>
        </ToastProvider>
    );

    function getPageClass(path: string): string{

        const pages = ROUTES

        return pages[path] || 'page-404'
    }
};

export default App;
