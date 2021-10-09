import Router from '@koa/router'
import usersRouter from './users.js'
import notesRouter from './notes.js'
import authRequired from '../middlewares/authRequired.js'

const router = new Router()

router.use('/users', usersRouter.routes())
router.use('/notes', authRequired, notesRouter.routes())

export default router
