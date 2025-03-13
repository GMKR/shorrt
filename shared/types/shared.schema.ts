import * as z from "zod"

export const EmailSchema = z.string({
  required_error: "Email is required",
}).email({
  message: "Invalid email address",
})

export const PasswordSchema = z.string({
  required_error: "Password is required",
}).min(8, {
  message: "Password must be at least 8 characters long",
})

export const SlugSchema = z.string({
  required_error: "Slug is required",
}).min(1, {
  message: "Slug must be at least 1 character long",
}).regex(/^[a-zA-Z0-9_-]+$/, {
  message: "Slug must contain only letters, numbers, underscores, and hyphens",
})
