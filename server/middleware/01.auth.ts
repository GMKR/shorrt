const ignoreAuth = (path: string) => {
  return path.startsWith("/api/auth") || path.startsWith("/api/_auth") || path.startsWith("/api/_nuxt_icon")
}

export default defineEventHandler(async (event) => {
  if (event?.path.startsWith("/api")) {
    if (!ignoreAuth(event.path)) {
      const { user } = await requireUserSession(event)
      event.context.userId = user.id
    }
  }
})
