export default eventHandler(async (event) => {
  const payload = await readValidatedBody(event, data => UserCreateBodySchema.parse(data))

  const [user] = await useDb().insert(tables.users).values({
    ...payload,
    password: await hashPassword(payload.password),
  }).returning()

  return user
})
