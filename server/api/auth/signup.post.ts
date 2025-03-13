import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const payload = await readValidatedBody(event, data => AuthSignupBodySchema.parse(data))
  // Check if Signup is enabled
  const canSignup = await useSignupEnabledCheck(event)
  if (!canSignup) {
    throw createError({
      statusCode: 403,
      statusMessage: "Signup is disabled",
    })
  }
  const existingUser = await useDb()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, payload.email))
  if (existingUser.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists",
    })
  }

  await useDb().insert(tables.users).values({
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    password: await hashPassword(payload.password),
  })
  return
})
