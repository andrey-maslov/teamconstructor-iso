export const IS_UNDER_CONSTR = Boolean(process.env.RAZZLE_IS_UNDER_CONSTRUCTION === '1')

export const SITE_TITLE = 'Teamconstructor'
export const CONTACT_EMAIL = 'contact@teamconstructor.com'
export const SERVICE = 2

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
    '/subscriptions': 'page-subscriptions',
    '/cookie-policy': 'page-content',
    '/privacy-policy': 'page-content',
    '/terms': 'page-content',
    '/rules-of-getting-and-cancelling': 'page-content',
    '/payment-rules': 'page-content',
    '/signin': 'page-auth',
    '/signin/forgot-password': 'page-auth',
    '/signin/forgot-password-success': 'page-auth',
    '/signin/reset-password': 'page-auth',
    '/registration': 'page-auth',
    '/save-email': 'save-email',
    '/confirm-email': 'confirm-email',
    '/auth/linkedin/callback': 'linkedin',
}

export const HOST = process.env.RAZZLE_SELF_HOST
export const BASE_API = process.env.RAZZLE_BASE_API
export const CONTENT_API = 'https://api.salary2.me'
export const TEST_URL = 'https://salary2.me/test'
export const API_VER = 1

export const TEST_THRESHOLD = 6.75
export const TEST_MAX_THRESHOLD = 218
export const TEAM_LENGTH_NORMAL = [3,9]

// TODO before production - remove 0 from list of ids
export const PREMIUM_ACCESS_LIST = [3, 4, 5]

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