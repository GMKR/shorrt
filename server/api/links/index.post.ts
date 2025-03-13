export default eventHandler(async (event) => {
  const payload = await readValidatedBody(event, data => LinkCreateBodySchema.parse(data))

  const [link] = await useDb().insert(tables.links)
    .values({
      ...payload,
    }).returning()

  return link!
})
