export const SITE_TITLE = 'Teamconstructor'
export const CONTACT_EMAIL = 'contact@teamconstructor.com'
export const SERVICE = 2

// export const LANGS = [
//     ['ru', 'Русский'],
//     ['en', 'English'],
//     ['pl', 'Polski'],
//     ['es', 'El español'],
//     ['de', 'Deutsch '],
//     ['fr', 'Le français'],
//     ['it', 'Italiano'],
// ];

export const LANGS = [
    ['ru', 'Русский'],
    ['en', 'English'],
]

export const LANG_DEFAULT = LANGS[0][0]

export const EMAIL_PATTERN = /^(?!['`])\s*[-+.'\w]+@[-.\w]+\.[-.\w]+\s*$/i

export const ROUTES = {
    '/': 'page-main',
    '/pair': 'page-pair',
    '/team': 'page-team',
    '/profile': 'page-profile',
    '/cookie-policy': 'page-content',
    '/privacy-policy': 'page-content',
    '/terms': 'page-content',
    '/signin': 'page-auth',
    '/signin/forgot-password': 'page-auth',
    '/signin/forgot-password-success': 'page-auth',
    '/signin/reset-password': 'page-auth',
    '/registration': 'page-auth',
    '/save-email': 'save-email',
    '/confirm-email': 'confirm-email',
}

export const BASE_API = 'https://apibase.pashtaljon.by'
export const CONTENT_API = 'https://api.salary2.me'
export const TEST_URL = 'https://salary.nobugs.today/test'
export const API_VER = 1

export const COLORS = {
    accent: '#36a9e0',
    yellow: '#FFC734',
    orange: '#FF5E34',
    textLight: '#b9b9b0',
    green: '#2FE77F',
    accent2: '#525DAC',
    grey: '#7D7D7D',
    greyBg: '#EFF1F4',
}

export enum authModes {
    'signin',
    'registration',
    'forgot_pwd',
    'reset_pwd',
    'forgot_pwd_success'
}

export const LINKEDIN_REDIRECT_URI = `${BASE_API}/callbacklinkedin`
