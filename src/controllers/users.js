import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as yup from 'yup'
import User from '../models/User.js'
import ServerError from '../errors/ServerError.js'
import scopeChecker from '../lib/scopeChecker.js'
import {
  getPagination,
  getQueryFilter,
  getSort,
  setCounts
} from '../utils/index.js'

const { ObjectId } = mongoose.Types

const scopesValidate = val => val?.every(item => {
  try {
    const splitted = item.split(':')
    return splitted.length === 2
  } catch {
    return false
  }
})

const getUsersControllers = () => {
  const getAll = async ctx => {
    const { limit, skip } = getPagination(ctx)
    const sort = getSort(ctx)
    const queryFilter = getQueryFilter(ctx, ['firstName', 'lastName', 'email'])

    const findFilters = { ...queryFilter }

    const users = await User
      .find(findFilters)
      .sort({ [sort.by]: sort.dir })
      .limit(limit)
      .skip(skip)

    const totalCount = await User.count(findFilters)
    setCounts(ctx, totalCount, limit)
    ctx.body = users
  }

  const getById = async ctx => {
    const { userSession } = ctx.state

    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }

    if (id !== userSession.sub) {
      scopeChecker('users:read')
    }

    const user = await User.findById(id)
    if (!user) {
      throw new ServerError(404)
    } else {
      ctx.body = user
      ctx.status = 200
    }
  }

  const create = async ctx => {
    const payload = ctx.request.body

    const yupSchema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
      scopes: yup.array().test({
        name: 'scopes',
        message: 'Scopes malformed',
        test: scopesValidate
      })
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

  const updateById = async ctx => {
    const { userSession } = ctx.state

    const { id } = ctx.request.params
    if (!ObjectId.isValid(id)) {
      throw new ServerError(404)
    }

    if (id !== userSession.sub) {
      scopeChecker('users:write')
    }

    const payload = ctx.request.body

    const yupSchema = yup.object().shape({
      firstName: yup.string(),
      lastName: yup.string(),
      email: yup.string().email(),
      password: yup.string().min(6),
      scopes: yup.array().test({
        name: 'scopes',
        message: 'Scopes malformed',
        test: scopesValidate
      })
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
    create,
    updateById,
    deleteById,
  }
}

export default getUsersControllers
