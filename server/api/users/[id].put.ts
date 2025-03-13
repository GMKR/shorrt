import { eq } from "drizzle-orm"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid user ID",
    })
  }
  const payload = await readValidatedBody(event, data => UserUpdateBodySchema.parse(data))
  await useDb().update(tables.users)
    .set({
      ...payload,
      isActive: payload.isActive === true || payload.isActive === false ? payload.isActive : undefined,
      password: payload.password ? await hashPassword(payload.password) : undefined,
    })
    .where(eq(tables.users.id, Number(id)))
    .returning()
  return
})
