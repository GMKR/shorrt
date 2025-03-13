export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  // Get the last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  // Format dates for SQLite (YYYY-MM-DD)
  const formatDate = (date: Date) => date.toISOString().split("T")[0]

  // Generate all dates for the last 30 days
  const dates = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo)
    date.setDate(date.getDate() + i)
    dates.push(formatDate(date))
  }

  // Query to get daily visit counts
  const db = useDb()
  const dailyVisits = await db.$client.prepare(`
    WITH dates(date) AS (
      VALUES ${dates.map(date => `('${date}')`).join(", ")}
    )
    SELECT 
      dates.date, 
      COUNT(activities.id) AS count
    FROM 
      dates
    LEFT JOIN 
      activities ON DATE(activities.timestamp / 1000, 'unixepoch') = dates.date 
      AND activities.linkId = ?
    GROUP BY 
      dates.date
    ORDER BY 
      dates.date
  `).bind(Number(id)).all()

  return dailyVisits.results
})
