import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const wishlist = await requireOwnWishlist(event)
  const gift = await requireGift(event, wishlist.id)

  await db
    .delete(tables.gifts)
    .where(eq(tables.gifts.id, gift.id))

  await deleteGiftImage(gift.imageId)

  notifyWishlistChanged(wishlist.id)
})
