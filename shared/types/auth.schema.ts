import * as z from "zod"
import { EmailSchema, PasswordSchema } from "./shared.schema"

export const AuthSignupBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: EmailSchema,
  password: PasswordSchema,
})

export type AuthSignupBody = z.infer<typeof AuthSignupBodySchema>

export const AuthLoginBodySchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export type AuthLoginBody = z.infer<typeof AuthLoginBodySchema>
