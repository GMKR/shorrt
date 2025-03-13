export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  // Query to get browser distribution
  const db = useDb()
  const browserDistribution = await db.$client.prepare(`
    WITH browser_counts AS (
      SELECT 
        COALESCE(browser, 'Unknown') AS browser,
        COUNT(*) AS count
      FROM 
        activities
      WHERE 
        linkId = ?
      GROUP BY 
        COALESCE(browser, 'Unknown')
      ORDER BY 
        count DESC
    ),
    top_browsers AS (
      SELECT browser, count
      FROM browser_counts
      ORDER BY count DESC
      LIMIT 5
    ),
    other_browsers AS (
      SELECT 'Others' AS browser, SUM(count) AS count
      FROM browser_counts
      WHERE browser NOT IN (SELECT browser FROM top_browsers)
      HAVING SUM(count) > 0
    )
    SELECT browser, count
    FROM top_browsers
    UNION ALL
    SELECT browser, count
    FROM other_browsers
    ORDER BY count DESC
  `).bind(Number(id)).all()

  return browserDistribution.results
})
