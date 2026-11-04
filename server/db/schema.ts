import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core'
import { wishlistColors, wishlistEmojis } from '../../shared/utils/wishlist-theme'

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
  slug: text().notNull().unique(),
  emoji: text({ enum: wishlistEmojis }).notNull().default('🎁'),
  color: text({ enum: wishlistColors }).notNull().default('rose'),
  eventDate: text(),
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
  reservationToken: text(),
  createdAt: createdAt(),
}, table => [
  index('gidts_wishlist_id_idx').on(table.wishlistId),
])
