export const SITE_TITLE = 'Teamconstructor'

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
];
export const LANG_DEFAULT = LANGS[0][0]

export const ROUTES = {
    '/':               'page-main',
    '/pair':           'page-pair',
    '/team':           'page-team',
    '/cookie-policy':  'page-content',
    '/privacy-policy': 'page-content',
    '/terms':          'page-content',
    '/login':          'page-auth',
    '/signup':         'page-auth',
};

export const BASE_API = 'https://api.teamconstructor.com'
export const CONTENT_API = 'https://api.salary2.me'

export const COLORS = {
    // accent: '#556587',
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
    'login',
    'signup',
    'forgot_pwd',
    'reset_pwd',
    'forgot_pwd_success'
}