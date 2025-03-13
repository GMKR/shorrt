import type { IncomingRequestCfProperties } from "@cloudflare/workers-types"
import { and, eq, sql } from "drizzle-orm"
import type { H3Event } from "h3"
import { UAParser } from "ua-parser-js"

export function getLinkKey(slug: string) {
  return `link:${slug}`
}

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

const parseUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent)
  return parser.getResult()
}

export const useGetRedirectLinkBySlug = async (slug: string) => {
  const key = getLinkKey(slug)
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
    code: link.config?.code || 302,
  }
}

export const useRecordLinkActivity = async (id: number, event: H3Event) => {
  const cf = event.context.cf as IncomingRequestCfProperties
  const allHeaders = getRequestHeaders(event)
  const parsedUserAgent = parseUserAgent(allHeaders["user-agent"] || "")
  const recordIpAddress = useRuntimeConfig(event).visitors.recordIpAddress

  await useDb().batch([
    useDb().insert(tables.activities).values({
      linkId: id,
      ip: recordIpAddress ? allHeaders["cf-connecting-ip"] : null,
      asOrg: cf.asOrganization,
      country: cf.country,
      region: cf.region,
      city: cf.city,
      continent: cf.continent,
      latitude: cf.latitude,
      longitude: cf.longitude,
      postalCode: cf.postalCode,
      userAgent: parsedUserAgent.ua,
      referrer: allHeaders["referer"],
      device: parsedUserAgent.device.type || "desktop",
      os: parsedUserAgent.os.name + " " + parsedUserAgent.os.version,
      browser: parsedUserAgent.browser.name + " " + parsedUserAgent.browser.version + (parsedUserAgent.browser.type ? ` (${parsedUserAgent.browser.type})` : ""),
    }),
    useDb().update(tables.links).set({
      visits: sql`${tables.links.visits} + 1`,
      lastVisit: new Date(),
    }).where(eq(tables.links.id, id)),
  ])
}
