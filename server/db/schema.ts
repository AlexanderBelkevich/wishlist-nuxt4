import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer().primaryKey({
    autoIncrement: true,
  }),
  githubId: integer().notNull().unique(),
  login: text().notNull(),
  name: text().notNull(),
  avatarUrl: text().notNull(),
  createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})
