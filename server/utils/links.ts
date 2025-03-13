import { and, eq } from "drizzle-orm"
import type { LinkActivity } from "~~/shared/types/links.schema"

const fetchDbLinkBySlug = async (slug: string) => {
  const fetchedLink = await useDb().query.links.findFirst({
    where: and(
      eq(tables.links.slug, slug),
      eq(tables.links.isActive, true)),
  })
  return fetchedLink
}

const parseLinkOptions = (to: string, options?: LinkConfig | null) => {
  const { forwardQuery, forwardQueryExclude, queryParams } = options || {}

  const url = new URL(to)

  if (forwardQuery) {
    const exclude = forwardQueryExclude || []
    const params = new URLSearchParams(url.search)

    params.forEach((value, key) => {
      if (!exclude.includes(key)) {
        url.searchParams.set(key, value)
      }
    })
  }

  if (queryParams) {
    const params = new URLSearchParams(url.search)
    params.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
  }

  return url.toString()
}

export const useGetRedirectLinkBySlug = async (slug: string) => {
  const key = `link:${slug}`
  let link = await hubKV().get<Awaited<ReturnType<typeof fetchDbLinkBySlug>>>(key)

  if (!link) {
    const fetchedLink = await fetchDbLinkBySlug(slug)

    if (!fetchedLink) {
      throw createError({ statusCode: 404, statusMessage: "Link not found" })
    }
    link = fetchedLink

    await hubKV().set(key, fetchedLink)
  }

  return {
    id: link.id,
    redirectUrl: parseLinkOptions(link.url, link.config),
  }
}

export const useRecordLinkActivity = async (id: number, activity: LinkActivity) => {
  await useDb().insert(tables.activities).values({
    linkId: id,
    timestamp: activity.timestamp,
    ip: activity.ip,
    country: activity.country,
    region: activity.region,
    city: activity.city,
    userAgent: activity.userAgent,
    referrer: activity.referrer,
    device: activity.device,
    os: activity.os,
    browser: activity.browser,
  })
}
