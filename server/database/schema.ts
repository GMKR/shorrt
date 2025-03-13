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
  title: text().notNull(),
  description: text(),
  url: text().notNull(),
  isActive: integer({ mode: "boolean" }).notNull().default(true),
  config: text({ mode: "json" }).$type<LinkConfig>(),
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

export const stats = sqliteTable("stats", {
  linkId: int().references(() => links.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }).primaryKey(),
  clicks: int().notNull().default(0),
  uniqueVisitors: int().notNull().default(0),
  lastClickedAt: integer({ mode: "timestamp_ms" }),
  ...dbtimestamps,
}, t => [
  index("stats_link_idx").on(t.linkId),
  index("stats_last_clicked_at_idx").on(t.lastClickedAt),
])

export const linkRelations = relations(links, ({ many }) => ({
  stats: many(stats),
  activities: many(activities),
}))

export const activityRelations = relations(activities, ({ one }) => ({
  link: one(links, {
    fields: [activities.linkId],
    references: [links.id],
  }),
}))

export const statsRelations = relations(stats, ({ one }) => ({
  link: one(links, {
    fields: [stats.linkId],
    references: [links.id],
  }),
}))
