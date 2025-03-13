export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  // Query to get country distribution
  const db = useDb()
  const countryDistribution = await db.$client.prepare(`
    WITH country_counts AS (
      SELECT 
        COALESCE(country, 'Unknown') AS country,
        COUNT(*) AS count
      FROM 
        activities
      WHERE 
        linkId = ?
      GROUP BY 
        COALESCE(country, 'Unknown')
      ORDER BY 
        count DESC
    ),
    top_countries AS (
      SELECT country, count
      FROM country_counts
      ORDER BY count DESC
      LIMIT 10
    ),
    other_countries AS (
      SELECT 'Others' AS country, SUM(count) AS count
      FROM country_counts
      WHERE country NOT IN (SELECT country FROM top_countries)
      HAVING SUM(count) > 0
    )
    SELECT country, count
    FROM top_countries
    UNION ALL
    SELECT country, count
    FROM other_countries
    ORDER BY count DESC
  `).bind(Number(id)).all()

  return countryDistribution.results
})
