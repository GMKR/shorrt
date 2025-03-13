export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  // Query to get device distribution
  const db = useDb()
  const deviceDistribution = await db.$client.prepare(`
    WITH device_counts AS (
      SELECT 
        COALESCE(device, 'Unknown') AS device,
        COUNT(*) AS count
      FROM 
        activities
      WHERE 
        linkId = ?
      GROUP BY 
        COALESCE(device, 'Unknown')
      ORDER BY 
        count DESC
    ),
    top_devices AS (
      SELECT device, count
      FROM device_counts
      ORDER BY count DESC
      LIMIT 5
    ),
    other_devices AS (
      SELECT 'Others' AS device, SUM(count) AS count
      FROM device_counts
      WHERE device NOT IN (SELECT device FROM top_devices)
      HAVING SUM(count) > 0
    )
    SELECT device, count
    FROM top_devices
    UNION ALL
    SELECT device, count
    FROM other_devices
    ORDER BY count DESC
  `).bind(Number(id)).all()

  return deviceDistribution.results
})
