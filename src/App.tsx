import React from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastProvider } from 'react-toast-notifications'
import { IS_UNDER_CONSTR, ROUTES } from './constants/constants'

import './index.scss'

import PairCoopPage from './pages/pair-coop-page/PairCoopPage'
import ErrorPage from './pages/error-page/ErrorPage'
import Modals from './components/common/modals/Modals'
import ScrollToTop from './components/common/layout/ScrollToTop'
import Footer from './components/common/layout/footer/Footer'
import Header from './components/common/layout/header/Header'
import ContentPage from './pages/content-page/ContentPage'
import AuthPage from './pages/auth-page/AuthPage'
import TeamCoopPage from './pages/team-coop-page/TeamCoopPage'
import ProfilePage from './pages/profile-page/ProfilePage'
import LandingPage from './pages/landing-page/LandingPage'
import ConfirmEmail from "./pages/confirm-email-page/ConfirmEmail";
import Linkedin from "./components/common/auth/social-auth/linkedin-login/Linkedin";
import SubscriptionsPage from "./pages/subscriptions-page/SubscriptionsPage";
import { globalStoreType } from "./constants/types";

const App: React.FC = () => {

    const { pathname } = useLocation()
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)
    const { projects } = useSelector((state: globalStoreType) => state.team)
    const isApp = pathname !== '/'

    const bodyClassList = `${isApp ? 'app' : 'site'} 
                            ${getPageClass(pathname)} 
                            ${isLoggedIn ? 'authorized' : 'unauthorized'}
                            ${projects.length ? 'with-sidebar' : ''}`

    if (IS_UNDER_CONSTR) {
        return (
            <ToastProvider>
                <div className={bodyClassList}>
                    <Header />
                    <Switch>
                        <Route exact path="/" render={() => <LandingPage />} />
                        <Route exact path="/cookie-policy" render={() => <ContentPage page="cookie-policy" />} />
                        <Route exact path="/privacy-policy" render={() => <ContentPage page="privacy-policy" />} />
                        <Route exact path="/terms" render={() => <ContentPage page="terms" />} />
                        <Route path="*" render={() => <ErrorPage />} />
                    </Switch>
                    <Footer />
                    <Modals />
                </div>
            </ToastProvider>
        )
    }

    return (
        <ToastProvider>
            <div className={bodyClassList}>
                <Header />
                {/*<ScrollToTop />*/}
                <Switch>
                    <Route exact path="/" render={() => <LandingPage />} />
                    <Route exact path="/pair" render={() => <PairCoopPage />} />
                    <Route exact path="/team" render={() => <TeamCoopPage />} />
                    <Route exact path="/profile" render={() => <ProfilePage />} />
                    <Route path="/subscriptions" render={() => <SubscriptionsPage />} />
                    <Route exact path="/cookie-policy" render={() => <ContentPage page="cookie-policy" />} />
                    <Route exact path="/privacy-policy" render={() => <ContentPage page="privacy-policy" />} />
                    <Route exact path="/terms" render={() => <ContentPage page="terms" />} />
                    <Route exact path="/signin" render={() => <AuthPage page="signin" />} />
                    <Route exact path="/signin/forgot-password" render={() => <AuthPage page="forgot_pwd" />} />
                    <Route exact path="/signin/forgot-password-success"
                           render={() => <AuthPage page="forgot_pwd_success" />} />
                    <Route exact path="/signin/reset-password" render={() => <AuthPage page="reset_pwd" />} />
                    <Route exact path="/registration" render={() => <AuthPage page="registration" />} />
                    <Route path="/auth/linkedin/callback" render={() => <Linkedin />} />
                    <Route path="/confirm-email" render={() => <ConfirmEmail />} />
                    <Route path="*" render={() => <ErrorPage />} />
                </Switch>
                <Footer />
                <Modals />
            </div>
        </ToastProvider>
    )

    function getPageClass(path: string): string {
        const pages = ROUTES
        return pages[path] || 'page-404'
    }
}

export default App

