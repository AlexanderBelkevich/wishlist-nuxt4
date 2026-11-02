import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core'

const createdAt = () => integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date())

export const users = sqliteTable('users', {
  id: integer().primaryKey({
    autoIncrement: true,
  }),
  githubId: integer().notNull().unique(),
  login: text().notNull(),
  name: text().notNull(),
  avatarUrl: text().notNull(),
  createdAt: createdAt(),
})

export const wishlists = sqliteTable('wishlists', {
  id: integer().primaryKey({
    autoIncrement: true,
  }),
  userId: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text().notNull(),
  createdAt: createdAt(),
}, table => [
  index('wishlists_user_id_idx').on(table.userId),
])

export const gifts = sqliteTable('gifts', {
  id: integer().primaryKey({
    autoIncrement: true,
  }),
  wishlistId: integer().notNull().references(() => wishlists.id, { onDelete: 'cascade' }),
  title: text().notNull(),
  url: text(),
  price: integer(),
  note: text(),
  createdAt: createdAt(),
}, table => [
  index('gidts_wishlist_id_idx').on(table.wishlistId),
])
