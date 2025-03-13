import { relations, sql } from "drizzle-orm"
import { index, int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

const dbtimestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
}

export const users = sqliteTable("users", {
  id: int().primaryKey(),
  firstName: text(),
  lastName: text(),
  email: text().notNull().unique(),
  password: text().notNull(),
  isActive: integer({ mode: "boolean" }).notNull().default(true),
  ...dbtimestamps,
})

export const links = sqliteTable("links", {
  id: int().primaryKey(),
  slug: text().notNull().unique(),
  url: text().notNull(),
  title: text(),
  description: text(),
  isActive: integer({ mode: "boolean" }).notNull().default(true),
  config: text({ mode: "json" }).$type<LinkConfig>(),
  visits: int().notNull().default(0),
  lastVisit: integer({ mode: "timestamp_ms" }),
  ...dbtimestamps,
})

export const activities = sqliteTable("activities", {
  id: int().primaryKey(),
  linkId: int().references(() => links.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }).notNull(),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  ip: text(),
  asOrg: text(),
  country: text(),
  region: text(),
  city: text(),
  continent: text(),
  latitude: text(),
  longitude: text(),
  postalCode: text(),
  userAgent: text(),
  referrer: text(),
  device: text(),
  os: text(),
  browser: text(),
}, t => [
  index("activity_link_idx").on(t.linkId),
  index("activity_timestamp_idx").on(t.timestamp),
])

export const linkRelations = relations(links, ({ many }) => ({
  activities: many(activities),
}))

export const activityRelations = relations(activities, ({ one }) => ({
  link: one(links, {
    fields: [activities.linkId],
    references: [links.id],
  }),
}))
