import * as z from "zod"
import { EmailSchema, PasswordSchema } from "./shared.schema"

export const AuthLoginBodySchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export type AuthLoginBody = z.infer<typeof AuthLoginBodySchema>
