import { and, desc, eq, like } from "drizzle-orm"

export default eventHandler(async (event) => {
  const { page, limit, isActive, term } = await getValidatedQuery(event, data => LinkPaginationQuerySchema.parse(data))

  const [results, total] = await Promise.all([
    useDb().query.links.findMany({
      where: and(
        isActive ? eq(tables.links.isActive, isActive) : undefined,
        term ? like(tables.links.slug, `%${term}%`) : undefined,
      ),
      orderBy: [desc(tables.links.createdAt)],
      offset: (page - 1) * limit,
      limit,
    }),
    useDb().$count(tables.links,
      and(
        isActive ? eq(tables.links.isActive, isActive) : undefined,
        term ? like(tables.links.slug, `%${term}%`) : undefined,
      ),
    ),
  ])

  return {
    results,
    total,
  }
})
