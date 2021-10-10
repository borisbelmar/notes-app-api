import Router from '@koa/router'
import usersRouter from './users.js'
import notesRouter from './notes.js'
import authRouter from './auth.js'
import authRequired from '../middlewares/authRequired.js'

const router = new Router()

router.use('/v1/users', usersRouter.routes())
router.use('/v1/notes', authRequired, notesRouter.routes())
router.use('/v1/auth', authRouter.routes())

router.get('/', ctx => {
  ctx.body = {
    app: process.env.npm_package_name,
    version: process.env.npm_package_version
  }
})

export default router
