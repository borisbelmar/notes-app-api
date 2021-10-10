import Router from '@koa/router'
import getAuthControllers from '../controllers/auth.js'

const authRouter = new Router()
const controllers = getAuthControllers()

authRouter.post('/register', controllers.register)
authRouter.post('/login', controllers.login)

export default authRouter
