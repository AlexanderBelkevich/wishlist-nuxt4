import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const { ids } = await readValidatedBody(event, giftsOrderSchema.parse)

  const gifts = await db
    .select({ id: tables.gifts.id })
    .from(tables.gifts)
    .where(eq(tables.gifts.wishlistId, wishlist.id))

  const current = new Set(gifts.map(gift => gift.id))
  const sameGifts = ids.length === current.size && ids.every(id => current.has(id))
  if (!sameGifts) {
    throw createError({ status: 409, message: 'Список подарков изменился, обновите страницу' })
  }

  await db.transaction(async (tx) => {
    for (const [position, id] of ids.entries()) {
      await tx.update(tables.gifts).set({ position }).where(eq(tables.gifts.id, id))
    }
  })
  notifyWishlistChanged(wishlist.id)
})
