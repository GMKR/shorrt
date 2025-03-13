import { eq } from "drizzle-orm"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid ID",
    })
  }
  const fetchedLink = await useDb().query.links.findFirst({
    where: eq(tables.links.id, Number(id)),
  })
  if (!fetchedLink) {
    throw createError({
      statusCode: 404,
      statusMessage: "Link not found",
    })
  }
  await hubKV().del(getLinkKey(fetchedLink.slug))
  await useDb().delete(tables.links)
    .where(eq(tables.links.id, Number(id)))
  return
})
