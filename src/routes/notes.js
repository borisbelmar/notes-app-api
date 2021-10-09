import Router from '@koa/router'
import getNotesControllers from '../controllers/notes.js'

const notesRouter = new Router()
const controllers = getNotesControllers()

notesRouter.get('/', controllers.getAll)
notesRouter.get('/:id', controllers.getById)
notesRouter.post('/', controllers.create)
notesRouter.put('/:id', controllers.updateById)
notesRouter.delete('/:id', controllers.deleteById)

export default notesRouter
