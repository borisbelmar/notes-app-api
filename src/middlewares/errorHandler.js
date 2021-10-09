const errorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    const { status, message } = e

    ctx.type = 'json'
    ctx.status = status || 500
    ctx.body = { message }

    ctx.app.emit('error', e, ctx)
  }
}

export default errorHandler
