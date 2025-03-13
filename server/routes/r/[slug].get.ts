export default eventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Invalid slug" })
  }
  const { id, redirectUrl, code } = await useGetRedirectLinkBySlug(slug)
  await useRecordLinkActivity(id, event)
  return sendRedirect(event, redirectUrl, code)
})
