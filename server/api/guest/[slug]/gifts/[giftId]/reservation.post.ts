// POST /api/guest/:slug/gifts/:giftId/reservation

import { and, eq, isNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireWishlistBySlug(event)
  const giftId = getIdParam(event, 'giftId')

  if (await isWishlistOwner(event, wishlist)) {
    throw createError({ statusCode: 403, message: 'Свои подарки бронировать нельзя' })
  }

  const token = ensureGuestToken(event)
  const reserved = await db
    .update(tables.gifts)
    .set({ reservationToken: token })
    .where(and(
      eq(tables.gifts.id, giftId),
      eq(tables.gifts.wishlistId, wishlist.id),
      isNull(tables.gifts.reservationToken),
    ))
    .returning({ id: tables.gifts.id })
    .get()

  if (!reserved) {
    throw createError({ statusCode: 409, message: 'Подарок уже забронировали или удалили' })
  }

  notifyWishlistChanged(wishlist.id)
})
