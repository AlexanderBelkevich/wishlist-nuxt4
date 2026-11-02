import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const giftId = getIdParam(event, 'giftId')

  const deleted = await db
    .delete(tables.gifts)
    .where(and(eq(tables.gifts.id, giftId), eq(tables.gifts.wishlistId, wishlist.id)))
    .returning({ id: tables.gifts.id })
    .get()

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Подарок не найден' })
  }
})
