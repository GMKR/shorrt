import { UserPaginationQuerySchema } from "~~/shared/types/users.schema"

export default defineEventHandler(async (event) => {
  const { page, limit } = await getValidatedQuery(event, data => UserPaginationQuerySchema.parse(data))

  const [results, total] = await Promise.all([
    useDb().query.users.findMany({
      limit,
      offset: (page - 1) * limit,
    }),
    useDb().$count(tables.users),
  ])

  return {
    results,
    total,
  }
})
