export default defineNuxtRouteMiddleware((to) => {
  const ignoreAuth = to.matched.some(route => route.meta.ignoreAuth)
  const { loggedIn } = useUserSession()
  if (!ignoreAuth) {
    if (!loggedIn.value) {
      return navigateTo({ name: "auth-signin" })
    }
  }
})
