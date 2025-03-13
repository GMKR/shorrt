import { and, desc, eq, gte, lte } from "drizzle-orm"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  const { limit, page, fromDate, toDate } = await getValidatedQuery(event, data => LinkActivityQuerySchema.parse(data))

  const [results, total] = await Promise.all([
    useDb().query.activities.findMany({
      where: and(
        eq(tables.activities.linkId, Number(id)),
        fromDate ? gte(tables.activities.timestamp, fromDate) : undefined,
        toDate ? lte(tables.activities.timestamp, toDate) : undefined,
      ),
      orderBy: desc(tables.activities.timestamp),
      limit,
      offset: (page - 1) * limit,
    }),
    useDb().$count(tables.activities, and(
      eq(tables.activities.linkId, Number(id)),
      fromDate ? gte(tables.activities.timestamp, fromDate) : undefined,
      toDate ? lte(tables.activities.timestamp, toDate) : undefined,
    )),
  ])

  return {
    results,
    total,
  }
})
