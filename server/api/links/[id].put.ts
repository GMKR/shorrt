import { eq } from "drizzle-orm"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  const payload = await readValidatedBody(event, data => LinkUpdateBodySchema.parse(data))

  await useDb().update(tables.links)
    .set({
      slug: payload.slug,
      url: payload.url,
      isActive: payload.isActive === true || payload.isActive === false ? payload.isActive : undefined,
      config: payload.config,
    })
    .where(eq(tables.links.id, Number(id)))

  return
})
