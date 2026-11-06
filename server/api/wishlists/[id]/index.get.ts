import { eq, asc } from 'drizzle-orm'
import { giftColumns } from '~~/server/utils/gifts'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)

  const gifts = await db
    .select(giftColumns)
    .from(tables.gifts)
    .where(eq(tables.gifts.wishlistId, wishlist.id))
    .orderBy(asc(tables.gifts.position), asc(tables.gifts.id))

  return {
    id: wishlist.id,
    title: wishlist.title,
    slug: wishlist.slug,
    emoji: wishlist.emoji,
    color: wishlist.color,
    eventDate: wishlist.eventDate,
    gifts: gifts.map(({ reservationToken, ...gift }) => ({
      ...gift,
      reserved: reservationToken !== null,
    })),
  }
})
