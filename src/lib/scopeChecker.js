import ServerError from '../errors/ServerError.js'

const scopeChecker = (scope, userScopes) => {
  const [entity, permission] = scope.split(':')

  const hasPermissions = userScopes?.some(userScope => {
    const [scopeEntity, scopePermission] = userScope.split(':')
    if (scopePermission === '*') {
      return scopeEntity === entity
    }
    return scopeEntity === entity && scopePermission === permission
  })

  if (!hasPermissions) {
    throw new ServerError(403)
  }
}

export default scopeChecker
