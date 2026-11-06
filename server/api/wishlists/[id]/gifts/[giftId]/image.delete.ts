import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const gift = await requireGift(event, wishlist.id)

  await db.update(tables.gifts).set({ imageId: null }).where(eq(tables.gifts.id, gift.id))
  await deleteGiftImage(gift.imageId)
})
