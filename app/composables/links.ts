export const useLinkList = (query: LinkPaginationQuery) => {
  const data = $fetch("/api/links", {
    query,
  })

  return data
}

export const useLinkSingle = (id: number) => {
  const data = $fetch(`/api/links/${id}`)

  return data
}

export const useLinkCreate = (body: LinkCreateBody) => {
  const response = $fetch("/api/links", {
    method: "POST",
    body,
  })

  return response
}

export const useLinkUpdate = (id: number, body: LinkUpdateBody) => {
  const response = $fetch(`/api/links/${id}`, {
    method: "PUT",
    body,
  })

  return response
}

export const useLinkDelete = (id: number) => {
  const response = $fetch(`/api/links/${id}`, {
    method: "DELETE",
  })

  return response
}

export const useLinkActivity = (id: number, query: LinkActivityListQuery) => {
  const data = $fetch(`/api/links/${id}/activity`, {
    query,
  })

  return data
}

export type LinkList = Awaited<ReturnType<typeof useLinkList>>
export type LinkListItem = LinkList["results"][number]
export type Link = Awaited<ReturnType<typeof useLinkSingle>>
export type LinkActivityList = Awaited<ReturnType<typeof useLinkActivity>>
export type LinkActivityListItem = LinkActivityList["results"][number]
