import { drizzle } from "drizzle-orm/d1"
import * as schema from "../database/schema"

export const tables = schema

export function useDb() {
  return drizzle(hubDatabase(), { schema, logger: useRuntimeConfig().db.logger })
}
