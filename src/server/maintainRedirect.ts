import { ROUTES } from '../constants/constants'

export const maintainRedirect = (req: any, res: any, next: any) => {

    const routes = Object.keys(ROUTES).filter(route => route !== '/')

    if (routes.includes(req.path) && process.env.RAZZLE_IS_UNDER_CONSTRUCTION == '1' && req.method === 'GET') {
        res.redirect('/')
    } else {
        next()
    }
}
