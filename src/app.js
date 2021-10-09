import Koa from 'koa'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import morgan from 'koa-morgan'

import router from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js'

const app = new Koa()

app.use(morgan('combined'))
app.use(cors())
app.use(koaBody({ jsonLimit: '1kb' }))
app.use(errorHandler)

app.use(router.routes())
app.use(router.allowedMethods())

export default app
