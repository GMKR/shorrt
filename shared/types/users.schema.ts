import * as z from "zod"
import { EmailSchema, PasswordSchema } from "./shared.schema"

export const UserCreateBodySchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  firstName: z.string({
    required_error: "First name is required",
  }),
  lastName: z.string({
    required_error: "Last name is required",
  }),
})

export type UserCreateBody = z.infer<typeof UserCreateBodySchema>

export const UserUpdateBodySchema = UserCreateBodySchema.extend({
  isActive: z.coerce.boolean().optional(),
}).partial()

export type UserUpdateBody = z.infer<typeof UserUpdateBodySchema>

export const UserPaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export type UserPaginationQuery = z.infer<typeof UserPaginationQuerySchema>
