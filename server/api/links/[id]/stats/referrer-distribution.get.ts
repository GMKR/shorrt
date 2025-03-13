export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid link ID" })
  }

  // Query to get referrer distribution
  const db = useDb()
  const referrerDistribution = await db.$client.prepare(`
    WITH referrer_counts AS (
      SELECT 
        COALESCE(referrer, 'Direct') AS referrer,
        COUNT(*) AS count
      FROM 
        activities
      WHERE 
        linkId = ?
      GROUP BY 
        COALESCE(referrer, 'Direct')
      ORDER BY 
        count DESC
      LIMIT 10
    )
    SELECT referrer, count
    FROM referrer_counts
    ORDER BY count DESC
  `).bind(Number(id)).all()

  // Process referrers to extract domains
  const results = (referrerDistribution.results as { referrer: string, count: number }[]).map((item) => {
    let referrer = item.referrer

    // Extract domain from URL
    if (referrer !== "Direct" && referrer.includes("://")) {
      try {
        const url = new URL(referrer)
        referrer = url.hostname
      }
      catch {
        // If URL parsing fails, use the original referrer
      }
    }

    return {
      referrer,
      count: item.count,
    }
  })

  // Combine duplicate domains after extraction
  const referrerMap = new Map<string, number>()
  results.forEach((item) => {
    referrerMap.set(item.referrer, (referrerMap.get(item.referrer) || 0) + item.count)
  })

  // Convert back to array and sort
  const finalResults = Array.from(referrerMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return finalResults
})
