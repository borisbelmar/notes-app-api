const getPagination = ctx => {
  const { limit = 10, page = 1 } = ctx.query

  return {
    page,
    limit,
    skip: limit * (page - 1)
  }
}

export default getPagination
