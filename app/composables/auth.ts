export const useHandleAuthSuccess = async () => {
  const { fetch: refetch } = useUserSession()
  await refetch()
  navigateTo({
    name: "dashboard",
  })
}

export const useCanSignup = async () => {
  const data = await $fetch("/api/auth/cansignup")
  return data
}

export const useAuthSignIn = async (body: AuthSignInBody) => {
  const data = await $fetch("/api/auth/signin", {
    method: "POST",
    body,
  })

  return data
}

export const useAuthSignup = async (body: AuthSignUpBody) => {
  const data = await $fetch("/api/auth/signup", {
    method: "POST",
    body,
  })

  return data
}
