import { desc, eq } from "drizzle-orm"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  const link = await useDb().query.links.findFirst({
    where: eq(tables.links.id, Number(id)),
    with: {
      activities: {
        limit: 10,
        orderBy: desc(tables.activities.timestamp),
      },
      stats: true,
    },
  })

  if (!link) {
    throw createError({ statusCode: 404, statusMessage: "Link not found" })
  }

  return link
})
