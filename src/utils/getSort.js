const sortDirections = {
  asc: 1,
  desc: -1
}

const getSort = ctx => {
  const { sortBy = 'createdAt', sortDir = 'ASC' } = ctx.query

  return {
    by: sortBy,
    dir: sortDirections[String(sortDir).toLowerCase()] || 1
  }
}

export default getSort
