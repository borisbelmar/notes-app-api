import Router from '@koa/router'
import getUsersControllers from '../controllers/users.js'
import authRequired from '../middlewares/authRequired.js'
import scopeRequired from '../middlewares/scopeRequired.js'

const usersRouter = new Router()
const controllers = getUsersControllers()

usersRouter.get('/', authRequired, scopeRequired('users:read'), controllers.getAll)
usersRouter.get('/:id', authRequired, controllers.getById)
usersRouter.post('/', authRequired, scopeRequired('users:write'), controllers.create)
usersRouter.put('/:id', authRequired, controllers.updateById)
usersRouter.delete('/:id', authRequired, scopeRequired('users:write'), controllers.deleteById)

export default usersRouter
