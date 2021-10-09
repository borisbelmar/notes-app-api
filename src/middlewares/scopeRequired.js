import ServerError from '../errors/ServerError.js'
import scopeChecker from '../lib/scopeChecker.js'

const scopeRequired = scope => async (ctx, next) => {
  const { userSession } = ctx.state

  if (!scope) {
    throw new ServerError(500, 'Scope must be defined!')
  }

  if (!userSession) {
    throw new ServerError(401)
  }

  const { scopes } = userSession

  scopeChecker(scope, scopes)

  await next()
}

export default scopeRequired
