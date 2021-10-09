import mongoose from 'mongoose'
import * as yup from 'yup'
import ServerError from '../errors/ServerError.js'
import Note from '../models/Note.js'

const { ObjectId } = mongoose.Types

const getNotesControllers = () => {
  const getAll = async ctx => {
    const { userSession } = ctx.state
    const notes = await Note.find({ user: userSession.sub })
    ctx.body = notes
    ctx.status = 200
  }

  const getById = async ctx => {
    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }
    const { userSession } = ctx.state
    const note = await Note.findOne({ _id: new ObjectId(id), user: userSession.sub }).populate('user', '-password').exec()
    if (!note) {
      throw new ServerError(404)
    } else {
      ctx.body = note
      ctx.status = 200
    }
  }

  const create = async ctx => {
    const payload = ctx.request.body

    const { userSession } = ctx.state

    const yupSchema = yup.object().shape({
      title: yup.string().min(3).required(),
      body: yup.string(),
      user: yup.string().test({ name: 'ObjectId', message: 'Invalid ObjectId', test: val => ObjectId.isValid(val) })
    })

    const payloadWithUser = { ...payload, user: userSession.sub }

    try {
      yupSchema.validateSync(payloadWithUser)
    } catch (e) {
      throw new ServerError(400, e.message)
    }

    const note = new Note(payloadWithUser)
    try {
      const createdNote = await note.save()
      ctx.body = createdNote
      ctx.status = 201
    } catch (e) {
      console.error(e)
      throw new ServerError(500)
    }
  }

  const updateById = async ctx => {
    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }
    const { userSession } = ctx.state
    const payload = ctx.request.body
    if (payload.user) {
      throw new ServerError(400, 'User cant be updated')
    }
    await Note.updateOne({ _id: new ObjectId(id), user: userSession.sub }, payload)
    ctx.status = 204
  }

  const deleteById = async ctx => {
    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }
    const { userSession } = ctx.state
    await Note.deleteOne({ _id: new ObjectId(id), user: userSession.sub })
    ctx.status = 204
  }

  return {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
  }
}

export default getNotesControllers