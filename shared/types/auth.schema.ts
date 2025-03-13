import * as z from "zod"
import { EmailSchema, PasswordSchema } from "./shared.schema"

export const AuthSignUpBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: EmailSchema,
  password: PasswordSchema,
})

export type AuthSignUpBody = z.infer<typeof AuthSignUpBodySchema>

export const AuthSignInBodySchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export type AuthSignInBody = z.infer<typeof AuthSignInBodySchema>
