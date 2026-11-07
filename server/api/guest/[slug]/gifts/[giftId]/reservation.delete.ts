// DELETE /api/guest/:slug/gifts/:giftId/reservation
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireWishlistBySlug(event)
  const giftId = getIdParam(event, 'giftId')
  const token = getGuestToken(event)

  if (!token) {
    throw createError({ statusCode: 404, message: 'Бронь не найдена' })
  }
  const cancelled = await db
  await db
    .update(tables.gifts)
    .set({ reservationToken: null })
    .where(and(
      eq(tables.gifts.id, giftId),
      eq(tables.gifts.wishlistId, wishlist.id),
      eq(tables.gifts.reservationToken, token),
    ))
    .returning({ id: tables.gifts.id })
    .get()

  if (!cancelled) {
    throw createError({ statusCode: 404, message: 'Бронь не найдена' })
  }

  notifyWishlistChanged(wishlist.id)
})
