// server/api/auth/login.post.ts
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const payload = await readValidatedBody(event, data => AuthSignInBodySchema.parse(data))

  // Find the user
  const user = await useDb().query.users.findFirst({
    where: eq(tables.users.email, payload.email),
  })
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    })
  }
  // Check the password
  const passwordMatch = await verifyPassword(user.password || "", payload.password)
  if (!passwordMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    })
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    loggedInAt: new Date(),
  })
  return
})
