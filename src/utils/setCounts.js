const setCounts = (ctx, totalCount, limit) => {
  ctx.set('X-Total-Count', totalCount)
  ctx.set('X-Total-Pages', Math.ceil(totalCount / limit))
}

export default setCounts
