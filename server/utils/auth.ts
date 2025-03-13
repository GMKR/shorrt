import { eq } from "drizzle-orm"
import type { H3Event } from "h3"

export const useSignupEnabledCheck = async (event: H3Event) => {
  const userCount = await useDb().$count(tables.users, eq(tables.users.isActive, true))
  const isSignupEnabled = useRuntimeConfig(event).auth.signupEnabled
  if (isSignupEnabled) {
    return true
  }
  return userCount < 1
}
