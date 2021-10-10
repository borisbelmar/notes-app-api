const getQueryFilter = (ctx, attributes) => {
  const { q } = ctx.query

  return q
    ? attributes.reduce((acc, attr) => (
      {
        $or: [
          ...acc.$or,
          { [attr]: { $regex: q, $options: 'i' } }
        ]
      }
    ), { $or: [] })
    : {}
}

export default getQueryFilter
