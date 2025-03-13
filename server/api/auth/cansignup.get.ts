export default defineEventHandler(async (event) => {
  const canSignup = await useSignupEnabledCheck(event)
  return {
    enabled: canSignup,
  }
})
