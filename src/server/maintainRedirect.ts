import { IS_UNDER_CONSTR, ROUTES } from '../constants/constants'

export const maintainRedirect = (req: any, res: any, next: any) => {

    const routes = Object.keys(ROUTES).filter(route => {
        return (route !== '/')
    })

    if (routes.includes(req.path) && IS_UNDER_CONSTR && req.method === 'GET') {
        res.redirect('/')
    } else {
        next()
    }
}
