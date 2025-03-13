import * as z from "zod"

export const LinkPaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  term: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
})

export type LinkPaginationQuery = z.infer<typeof LinkPaginationQuerySchema>

export const LinkConfigSchema = z.object({
  forwardQuery: z.boolean().optional().default(false),
  forwardQueryExclude: z.array(z.string()).optional(),
  queryParams: z.boolean().optional().default(false),
  code: z.number().optional().default(302),
})

export type LinkConfig = z.infer<typeof LinkConfigSchema>

export const LinkCreateBodySchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }).min(1),
  description: z.string().optional(),
  slug: z.string({
    required_error: "Slug is required",
  }).min(1),
  url: z.string({
    required_error: "URL is required",
  }).url(),
  config: LinkConfigSchema.optional(),
})

export type LinkCreateBody = z.infer<typeof LinkCreateBodySchema>

export const LinkUpdateBodySchema = LinkCreateBodySchema.extend({
  isActive: z.coerce.boolean().optional(),
}).partial()

export type LinkUpdateBody = z.infer<typeof LinkUpdateBodySchema>

export const LinkActivityQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
})

export type LinkActivityQuery = z.infer<typeof LinkActivityQuerySchema>

export const LinkActivitySchema = z.object({
  ip: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  device: z.string().optional(),
  os: z.string().optional(),
  browser: z.string().optional(),
})

export type LinkActivity = z.infer<typeof LinkActivitySchema>
