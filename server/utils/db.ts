import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../db/schema'

export const db = drizzle({
  connection: {
    url: useRuntimeConfig().databaseUrl },
  casing: 'snake_case',
})

export const tables = schema
