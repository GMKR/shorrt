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
