import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const jwtSign = payload => jwt.sign(payload, JWT_SECRET)

export const jwtValidate = token => jwt.verify(token, JWT_SECRET, { expiresIn: '7d' })
