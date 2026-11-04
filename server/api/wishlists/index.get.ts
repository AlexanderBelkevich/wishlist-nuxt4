import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  return db
    .select(
      {
        id: tables.wishlists.id,
        title: tables.wishlists.title,
        emoji: tables.wishlists.emoji,
        color: tables.wishlists.color,
        eventDate: tables.wishlists.eventDate,
      })
    .from(tables.wishlists)
    .where(eq(tables.wishlists.userId, user.id))
    .orderBy(desc(tables.wishlists.id))
})
