import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireWishlistBySlug(event)
  const guestToken = getGuestToken(event)

  const owner = await db
    .select({ name: tables.users.name, avatarUrl: tables.users.avatarUrl })
    .from(tables.users)
    .where(eq(tables.users.id, wishlist.userId))
    .get()

  const gifts = await db
    .select(giftColumns)
    .from(tables.gifts)
    .where(eq(tables.gifts.wishlistId, wishlist.id))
    .orderBy(asc(tables.gifts.id))

  return {
    title: wishlist.title,
    owner: owner!,
    isOwner: await isWishlistOwner(event, wishlist),
    emoji: wishlist.emoji,
    color: wishlist.color,
    eventDate: wishlist.eventDate,
    gifts: gifts.map(({ reservationToken, ...gift }) => ({
      ...gift,
      reserved: reservationToken !== null,
      reservedByMe: reservationToken === guestToken,
    })),
  }
})
