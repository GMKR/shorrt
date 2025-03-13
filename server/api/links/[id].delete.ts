import { eq } from "drizzle-orm"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid ID",
    })
  }

  const link = await useDb().delete(tables.links).where(eq(tables.links.id, Number(id)))

  return link
})
