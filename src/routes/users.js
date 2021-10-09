import Router from '@koa/router'
import getUsersControllers from '../controllers/users.js'
import authRequired from '../middlewares/authRequired.js'
import scopeRequired from '../middlewares/scopeRequired.js'

const usersRouter = new Router()
const controllers = getUsersControllers()

usersRouter.get('/', authRequired, scopeRequired('users:read'), controllers.getAll)
usersRouter.get('/:id', authRequired, scopeRequired('users:read'), controllers.getById)
usersRouter.post('/', controllers.register)
usersRouter.post('/login', controllers.login)
usersRouter.put('/:id', authRequired, scopeRequired('users:write'), controllers.updateById)
usersRouter.delete('/:id', authRequired, scopeRequired('users:write'), controllers.deleteById)

export default usersRouter
