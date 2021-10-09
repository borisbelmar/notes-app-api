import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as yup from 'yup'
import User from '../models/User.js'
import { jwtSign } from '../lib/jwt.js'
import ServerError from '../errors/ServerError.js'

const { ObjectId } = mongoose.Types

const getUsersControllers = () => {
  const getAll = async ctx => {
    const users = await User.find()
    ctx.body = users
  }

  const getById = async ctx => {
    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }
    const user = await User.findById(id)
    if (!user) {
      throw new ServerError(404)
    } else {
      ctx.body = user
      ctx.status = 200
    }
  }

  const register = async ctx => {
    const payload = ctx.request.body

    const yupSchema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
    })

    try {
      yupSchema.validateSync(payload)
    } catch (e) {
      throw new ServerError(400, e.message)
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(payload.password, salt)

    const user = new User({ ...payload, password: hash })

    try {
      const createdUser = await user.save()
      ctx.body = createdUser
      ctx.status = 201
    } catch (e) {
      if (e.code === 11000) {
        throw new ServerError(409)
      }
      throw new ServerError(500)
    }
  }

  const login = async ctx => {
    const payload = ctx.request.body

    const yupSchema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
    })

    if (!yupSchema.isValidSync(payload)) {
      throw new ServerError(401)
    }

    const user = await User.findOne({ email: payload.email })

    if (!user || !bcrypt.compareSync(payload.password, user.password)) {
      throw new ServerError(401)
    }

    const accessToken = jwtSign({
      sub: user._id,
      cid: user._id,
      scopes: user.scopes
    })

    ctx.body = {
      accessToken
    }
    ctx.status = 200
  }

  const updateById = async ctx => {
    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }
    const payload = ctx.request.body

    const yupSchema = yup.object().shape({
      firstName: yup.string(),
      lastName: yup.string(),
      email: yup.string().email(),
      password: yup.string().min(6)
    })

    try {
      yupSchema.validateSync(payload)
    } catch (e) {
      throw new ServerError(400, e.message)
    }

    if (payload?.password) {
      const salt = bcrypt.genSaltSync(10)
      const hashed = bcrypt.hashSync(payload.password, salt)
      await User.updateOne({ _id: new ObjectId(id) }, { ...payload, password: hashed })
    } else {
      await User.updateOne({ _id: new ObjectId(id) }, payload)
    }

    ctx.status = 204
  }

  const deleteById = async ctx => {
    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }
    await User.deleteOne({ _id: new ObjectId(id) })
    ctx.status = 204
  }

  return {
    getAll,
    getById,
    register,
    login,
    updateById,
    deleteById,
  }
}

export default getUsersControllers
